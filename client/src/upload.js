import axios from "axios";

export async function uploadMedia({type, preset, file}, setProgress) {
  const formData = new FormData();
  formData.append("upload_preset", preset);
  formData.append("file", file);

  const data = await axios
    .post(
      `https://api.cloudinary.com/v1_1/ibrahimasry/${type}/upload`,
      formData,
      {
        onUploadProgress,
      }
    )
    .then((res) => res.data);
  function onUploadProgress({loaded, total}) {
    setProgress(Math.round(loaded / total) * 100);
  }
  return data.secure_url;
}
