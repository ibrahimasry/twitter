import axios from "axios";

export async function uploadMedia({type, preset, file}, setProgress) {
  const formData = new FormData();
  formData.append("upload_preset", preset);
  formData.append("file", file);

  const res = await axios
    .post(
      `https://api.cloudinary.com/v1_1/ibrahimasry/${type}/upload`,
      formData,
      {
        onUploadProgress,
      }
    )

    .catch(console.log);
  function onUploadProgress({loaded, total}) {
    setProgress(Math.round((loaded / total) * 100));
  }

  console.log(res, "resdata");
  return res.data?.secure_url;
}
