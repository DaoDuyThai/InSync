import axios from "axios";
export default function uploadImage(base64EncodedImage: string) {
    const CLOUD_NAME = `dsheuafar`;
    const PRESET_NAME = `Blog-image-upload`;
    const url = "";
    const FOLDER_NAME = "Blog";
    const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER_NAME);
    formData.append("file", base64EncodedImage);
    axios
      .post(api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data.url);
        return response
      })
      .catch((error) => {
        console.log(error);
      });
  };
