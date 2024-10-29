import axios from "axios";
export default async function uploadImage(base64EncodedImage: string) {
  const CLOUD_NAME = `dt3zxmzwx33`;
  const API_KEY = `913766755358889`;
  const API_SECRET = `zKToJDsAAkxF2O67i2eHYlTX-g0`;
  const PRESET_NAME = `default_upload`;

  const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("upload_preset", PRESET_NAME);
  // formData.append("folder", FOLDER_NAME);
  formData.append("file", base64EncodedImage);
  formData.append("api_key", API_KEY);
  formData.append("api_secret", API_SECRET);

  await axios
    .post(api, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data.url);
      uploadImageToDB(response.data.url);
      return response
    })
    .catch((error) => {
      console.log(error);
    });
};


async function uploadImageToDB(imgURL: string) {
  const url = "https://in-sync-71cacf992634.herokuapp.com/api/assets";
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  const imgName = formattedDate + "_Image_" + "21B012D5-2F45-4850-8DBB-43590DD7D750";
  const data = {
    "projectId": "21B012D5-2F45-4850-8DBB-43590DD7D750",
    "assetName": imgName,
    "type": "image",
    "filePath": imgURL
  };
  await axios
    .post(url, data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
