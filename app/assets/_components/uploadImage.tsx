import axios from "axios";
export default function uploadImage(base64EncodedImage: string) {
    const CLOUD_NAME = `dt3zxmzwx33`; 
    const API_KEY = `913766755358889`;
    const API_SECRET = `zKToJDsAAkxF2O67i2eHYlTX-g0`;
    const PRESET_NAME = `default_upload`;

    // const PRESET_NAME = `Blog-image-upload`;
    // const FOLDER_NAME = "Blog";
    const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("upload_preset", PRESET_NAME);
    // formData.append("folder", FOLDER_NAME);
    formData.append("file", base64EncodedImage);
    formData.append("api_key", API_KEY);
    formData.append("api_secret", API_SECRET);

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
