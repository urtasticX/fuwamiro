# Firebase — Fuwamiro

The app now initializes Firebase project `fuwamiro` using the supplied public web configuration. Optional environment overrides are listed in `.env.example`.

## Connected code

- `src/lib/firebase.ts`: shared app, Firestore, Storage, lazy Authentication, browser-only Analytics with support checks.
- `src/lib/repository.ts`: reads public Firestore collections; document IDs are authoritative.
- `src/components/providers.tsx`: loads Firebase data and exposes connection status/errors. Sample content remains available when reading fails. A successfully connected empty database shows no cats.

## Firebase Console setup

1. Create the default Cloud Firestore database, if not already created.
2. Enable Authentication → Email/Password and create the admin account.
3. Add the production domain and `localhost` under Authentication → Settings → Authorized domains.
4. Initialize Storage with `fuwamiro.firebasestorage.app`, if not already enabled.
5. Review and deploy `firestore.rules` and `storage.rules` to this project. With an authenticated Firebase CLI: `firebase deploy --only firestore:rules,firestore:indexes,storage --project fuwamiro`.
6. Grant the admin account the custom claim `{ admin: true }` from a trusted Admin SDK environment. Web clients cannot assign their own admin claim. Sign in again after the claim changes. Never place a service-account key in frontend code.

The supplied web config initializes the SDK; it does not provide console permissions or authorize rule deployment. The rules here have not been deployed automatically.

### Live check on 13 October 2026

The SDK reached Google’s backend, which reported that the Cloud Firestore API has not been used or is disabled for `fuwamiro`. Enable it in the Firebase Console by creating Firestore, or visit https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=fuwamiro.

The currently logged-in Firebase CLI account did not list `fuwamiro`; no active Google Cloud CLI account was available. Sign in with a Firebase account that has access to this project before deploying rules. Authentication sign-in, Storage uploads, and Analytics delivery have not yet been verified against the live project.

## Collections

| Collection | Document ID | Contents | Access |
| --- | --- | --- | --- |
| `cats` | Stable cat ID | `Cat` from `src/lib/types.ts`; include matching `id` | Public read; admin write |
| `litters` | Stable litter ID | Parent IDs and birth date | Public read; admin write |
| `timeline_events` | Event ID | `cat_id`, date, bilingual text, photo URLs, optional video URL | Public read; admin write |
| `site_content` | `main` | `SiteContent` fields directly, without a `value` wrapper | Public read; admin write |
| `private_health` | Cat ID or record ID | Private health records | Admin only |

Firestore is a document database. References such as `father_id`, `mother_id`, and `litter_id` preserve relationships; they are not SQL foreign keys. Changing a cat's `stage` updates the same document. Enforce relationship validation in the future admin write layer.

Public media goes under `public/`; private medical files go under `private/`. Do not create public download links for private medical files.

No sample records have been uploaded to the live project. The admin dashboard and full website styling are still in progress; this change establishes the Firebase integration first.

## Verify locally

Run `npm run typecheck` and `npm run build`. Then run `npm run dev` to view the site. Analytics initializes only in a supported browser, so server rendering and static export can run safely.

Official references: [Web setup](https://firebase.google.com/docs/web/setup), [Firestore Rules](https://firebase.google.com/docs/firestore/security/rules-conditions).
