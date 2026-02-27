import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

export async function uploadImage(file: File, path: string): Promise<string> {
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}
