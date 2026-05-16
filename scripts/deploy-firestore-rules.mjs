#!/usr/bin/env node
// Deploy firestore.rules to the configured Firebase project using a
// service-account JSON (FIREBASE_SERVICE_ACCOUNT_JSON env var) — works
// from CI / without `firebase login`.
//
// Run from the repo root:
//   node scripts/deploy-firestore-rules.mjs
//
// The Firebase CLI's `firebase deploy --only firestore:rules` is the
// canonical path; this script exists so we can deploy with just a
// service-account key (no interactive OAuth, no `serviceusage` role).

import { GoogleAuth } from "google-auth-library";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!saJson) {
    console.error("Set FIREBASE_SERVICE_ACCOUNT_JSON (see .env.local) and try again.");
    process.exit(1);
  }
  const sa = JSON.parse(saJson);
  const project = sa.project_id;

  // Write SA temporarily so GoogleAuth can read it from disk.
  const tmpKey = path.join("/tmp", `sa-${Date.now()}.json`);
  fs.writeFileSync(tmpKey, JSON.stringify(sa));

  try {
    const auth = new GoogleAuth({
      keyFile: tmpKey,
      scopes: [
        "https://www.googleapis.com/auth/firebase",
        "https://www.googleapis.com/auth/cloud-platform",
      ],
    });
    const token = await auth.getAccessToken();
    const content = fs.readFileSync("./firestore.rules", "utf8");

    console.log("→ creating ruleset…");
    const cr = await fetch(
      `https://firebaserules.googleapis.com/v1/projects/${project}/rulesets`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ source: { files: [{ name: "firestore.rules", content }] } }),
      }
    );
    if (!cr.ok) {
      console.error("create ruleset failed:", cr.status, await cr.text());
      process.exit(1);
    }
    const ruleset = await cr.json();
    console.log("  ruleset:", ruleset.name);

    console.log("→ updating release pointer…");
    const releaseName = `projects/${project}/releases/cloud.firestore`;
    const pr = await fetch(
      `https://firebaserules.googleapis.com/v1/${releaseName}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          release: { name: releaseName, rulesetName: ruleset.name },
          updateMask: "rulesetName",
        }),
      }
    );
    if (!pr.ok) {
      console.error("update release failed:", pr.status, await pr.text());
      process.exit(1);
    }
    const rel = await pr.json();
    console.log("✓ live at", rel.updateTime);
  } finally {
    fs.unlinkSync(tmpKey);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
