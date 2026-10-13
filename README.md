# Fuwamiro

A boutique cattery website built with Next.js, TypeScript, Motion, and Firebase.

## Development

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
```

The application uses a static Next.js export in `out/`. Firestore content is loaded in the browser. Optional Firebase configuration overrides are documented in `.env.example`.

The site is hosted at [fuwamiro.web.app](https://fuwamiro.web.app). To publish an update, run `npm run build` followed by `firebase deploy --only hosting --project fuwamiro` with a Firebase account that has access to this project.

See [Firebase setup](FIREBASE_SETUP.md) for database collections, access rules, and remaining console setup.

## Current state

The responsive public site includes cat and kitten profiles, an animated journey timeline, a linked family tree, filters, photo galleries, alumni stories, and Thai/English copy. The authenticated admin area can manage cats, litters, events, public content, photos, and private health records. Generated sample cats and photos are illustrative. No sample data is uploaded automatically.

The website shows sample content while Firestore access is unavailable or the content collections are empty. See [Firebase setup](FIREBASE_SETUP.md) for the steps needed before real content can be edited in the admin area.
