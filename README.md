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

See [Firebase setup](FIREBASE_SETUP.md) for database collections, access rules, and remaining console setup.

## Current state

The public page components and Firebase integration are in place. Full styling, image assets, the admin dashboard, and production deployment are still in progress. Sample data is used when Firestore cannot be read. No sample data has been uploaded automatically.
