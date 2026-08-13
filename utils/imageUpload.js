/**
 * Helpers for multipart image uploads that work with Expo SDK 57+ / RN fetch.
 * Avoid appending { uri, type, name } objects — that throws
 * "Unsupported FormDataPart implementation".
 */

export async function uriToFormDataFile(uri, filename = "photo.jpg", mimeType = "image/jpeg") {
  const response = await fetch(uri);
  const blob = await response.blob();
  const type = blob.type || mimeType;
  // File is available in modern RN / Hermes; fall back to Blob with name via FormData
  if (typeof File !== "undefined") {
    return new File([blob], filename, { type });
  }
  blob.name = filename;
  blob._name = filename;
  return blob;
}

export async function appendImageUris(formData, fieldName, uris) {
  for (let i = 0; i < uris.length; i += 1) {
    const uri = uris[i];
    if (!uri) continue;
    const ext = (uri.split(".").pop() || "jpg").split("?")[0].toLowerCase();
    const mime =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : "image/jpeg";
    const filename = `photo_${i}.${ext === "png" || ext === "webp" ? ext : "jpg"}`;
    const file = await uriToFormDataFile(uri, filename, mime);
    formData.append(fieldName, file, filename);
  }
  return formData;
}

export const IMAGE_PICKER_MEDIA_TYPES = ["images"];
