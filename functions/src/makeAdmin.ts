import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

export const makeAdmin = onCall(async (request) => {
    const { uid } = request.data;

    if (!uid) {
        throw new HttpsError("invalid-argument", "UID requerido");
    }

    await admin.auth().setCustomUserClaims(uid, {
        admin: true,
    });

    return { success: true };
});
