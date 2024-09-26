import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export default function Upload(image: any) {
    cloudinary.uploader.upload(image, function(error: any, result: any) {
        console.log(result, error)
    });
}