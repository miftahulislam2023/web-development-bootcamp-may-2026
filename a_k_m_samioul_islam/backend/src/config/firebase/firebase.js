import admin from "firebase-admin";
import serviceAccount from "../../../walletwatch.json" with { type: "json" };

// const decoded=Buffer.from(process.env.FB_SERVICE_KEY,"base64").toString("utf8");

// const serviceAccount=JSON.parse(decoded);

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

export const auth=admin.auth();