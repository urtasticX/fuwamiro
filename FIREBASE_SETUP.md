# Firebase — Fuwamiro

The app now initializes Firebase project `fuwamiro` using the supplied public web configuration. Optional environment overrides are listed in `.env.example`.

## Connected code

- `src/lib/firebase.ts`: shared app, Firestore, Storage, lazy Authentication, browser-only Analytics with support checks.
- `src/lib/repository.ts`: reads public Firestore collections; document IDs are authoritative.
- `src/components/providers.tsx`: loads Firebase data and exposes connection status/errors. Sample content remains available when reading fails. A successfully connected empty database shows no cats.

## Firebase Console setup

1. Create the admin account in Authentication → Users. Email/Password sign-in is enabled.
2. `fuwamiro.web.app` and `localhost` are already authorized. Add any future custom domain under Authentication → Settings → Authorized domains.
3. Grant the admin account access. Add an `admins/{uid}` document with `enabled: true` (boolean) in the Firebase Console. The UID is shown on the admin page after signing in. Alternatively, set the custom claim `{ admin: true }` from a trusted Admin SDK environment. Sign in again after the claim changes. Never place a service-account key in frontend code.

The supplied web config initializes the SDK. The website is deployed to Firebase Hosting at `https://fuwamiro.web.app`.

### Live check on 13 October 2026

Cloud Firestore, Firebase Storage, and Email/Password Authentication are enabled. The repository Firestore and Storage rules were deployed after passing five local emulator tests. An admin user and `admins/{uid}` grant still need to be created; authenticated uploads have not yet been tested against the live project.

## Collections

| Collection        | Document ID         | Contents                                                       | Access                   |
| ----------------- | ------------------- | -------------------------------------------------------------- | ------------------------ |
| `cats`            | Stable cat ID       | `Cat` from `src/lib/types.ts`; include matching `id`           | Public read; admin write |
| `litters`         | Stable litter ID    | Parent IDs and birth date                                      | Public read; admin write |
| `timeline_events` | Event ID            | `cat_id`, date, Thai text, photo URLs, optional video URL      | Public read; admin write |
| `site_content`    | `main`              | `SiteContent` fields directly, without a `value` wrapper       | Public read; admin write |
| `private_health`  | Cat ID or record ID | Private health records                                         | Admin only               |
| `admins`          | Firebase Auth UID    | `{ enabled: true }`                                            | The matching user may read; only Firebase Console / Admin SDK may write |

Firestore is a document database. References such as `father_id`, `mother_id`, and `litter_id` preserve relationships; they are not SQL foreign keys. Changing a cat's `stage` updates the same document. The admin editor validates parent links and prevents deleting a cat that is still linked to a family, litter, timeline, or private health record.

Public media goes under `public/`; private medical files go under `private/`. Do not create public download links for private medical files.

No sample records have been uploaded to the live project. The admin dashboard has an explicit sample import button that only works when cat, litter, and timeline collections are empty.

## Verify locally

Run `npm run typecheck` and `npm run build`. Run `firebase emulators:exec --project demo-fuwamiro --config firebase.test.json --only firestore,storage 'node --test scripts/firebase-rules.test.mjs'` to verify the security rules. Then run `npm run dev` to view the site. Analytics initializes only in a supported browser, so server rendering and static export can run safely.

Official references: [Web setup](https://firebase.google.com/docs/web/setup), [Firestore Rules](https://firebase.google.com/docs/firestore/security/rules-conditions).
