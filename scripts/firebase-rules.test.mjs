import { readFile } from "node:fs/promises";
import { before, after, test } from "node:test";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getBytes } from "firebase/storage";
let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-fuwamiro",
    firestore: { rules: await readFile("firestore.rules", "utf8") },
    storage: { rules: await readFile("storage.rules", "utf8") },
  });
  await env.withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), "cats", "moon"), {
      id: "moon",
      name: "Moon",
    });
    await setDoc(doc(c.firestore(), "private_health", "moon"), {
      notes: "Private record",
    });
    await setDoc(doc(c.firestore(), "admins", "approved-admin"), {
      enabled: true,
    });
    await uploadBytes(
      ref(c.storage(), "private/record.pdf"),
      new Uint8Array([1, 2, 3]),
      { contentType: "application/pdf" },
    );
  });
});
after(async () => {
  await env?.cleanup();
});
test("Visitors can read public profiles but cannot write or read private health", async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, "cats", "moon")));
  await assertFails(
    setDoc(doc(db, "cats", "moon"), { id: "moon", name: "Changed" }),
  );
  await assertFails(getDoc(doc(db, "private_health", "moon")));
});
test("Signing in alone does not grant admin privileges", async () => {
  const db = env.authenticatedContext("visitor").firestore();
  await assertFails(
    setDoc(doc(db, "cats", "moon"), { id: "moon", name: "Changed" }),
  );
  await assertFails(getDoc(doc(db, "private_health", "moon")));
  await assertFails(setDoc(doc(db, "admins", "visitor"), { enabled: true }));
});
test("Approved admin can edit, but cannot attach private notes to a public cat", async () => {
  const db = env.authenticatedContext("approved-admin").firestore();
  await assertSucceeds(
    setDoc(doc(db, "cats", "bomi"), { id: "bomi", name: "Bomi" }),
  );
  await assertSucceeds(getDoc(doc(db, "private_health", "moon")));
  await assertFails(
    setDoc(doc(db, "cats", "bomi"), {
      id: "bomi",
      name: "Bomi",
      private_notes: "Private",
    }),
  );
  await assertFails(
    setDoc(doc(db, "cats", "bomi"), { id: "wrong-id", name: "Bomi" }),
  );
});
test("Custom admin claim also authorizes content management", async () => {
  const db = env
    .authenticatedContext("claim-admin", { admin: true })
    .firestore();
  await assertSucceeds(
    setDoc(doc(db, "site_content", "main"), {
      intro: { th: "บ้าน", en: "Home" },
    }),
  );
});
test("Media upload checks role, file type and private record access", async () => {
  const anon = env.unauthenticatedContext().storage();
  const visitor = env.authenticatedContext("visitor").storage();
  const admin = env
    .authenticatedContext("claim-admin", { admin: true })
    .storage();
  await assertFails(
    uploadBytes(ref(visitor, "public/cat.webp"), new Uint8Array([1, 2, 3]), {
      contentType: "image/webp",
    }),
  );
  await assertSucceeds(
    uploadBytes(ref(admin, "public/cat.webp"), new Uint8Array([1, 2, 3]), {
      contentType: "image/webp",
    }),
  );
  await assertFails(
    uploadBytes(ref(admin, "public/unsafe.svg"), new Uint8Array([1, 2, 3]), {
      contentType: "image/svg+xml",
    }),
  );
  await assertFails(getBytes(ref(anon, "private/record.pdf")));
  await assertFails(getBytes(ref(visitor, "private/record.pdf")));
  await assertSucceeds(getBytes(ref(admin, "private/record.pdf")));
});
