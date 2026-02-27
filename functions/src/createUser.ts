import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

export const createUser = onCall(async (request) => {
  const { auth, data } = request;

  // 🔒 Verificar autenticación
  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "Debes estar autenticado"
    );
  }

  // 🔒 Verificar admin
  const caller = await admin.auth().getUser(auth.uid);
  if (!caller.customClaims?.admin) {
    throw new HttpsError(
      "permission-denied",
      "No eres administrador"
    );
  }

  const { email, password, isAdmin } = data;

  if (!email || !password) {
    throw new HttpsError(
      "invalid-argument",
      "Email y contraseña requeridos"
    );
  }

  // 👤 Crear usuario Auth
  const userRecord = await admin.auth().createUser({
    email,
    password,
  });

  // 🔐 Rol admin
  if (isAdmin) {
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
    });
  }

  // 🗄️ Firestore
  await admin.firestore().collection("users").doc(userRecord.uid).set({
    email,
    isAdmin,
    projects: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});
