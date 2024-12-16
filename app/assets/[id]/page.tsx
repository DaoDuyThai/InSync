'use client'
import ImageCopper from "@/components/image-cropper";
import { useEffect, useState } from "react";



export default function ImageCroppedPage(): JSX.Element {
    const [imgURL, setImgURL] = useState<string>("");
    const [imgName, setImgName] = useState<string>("");
    useEffect(() => {
        const imgURL = localStorage.getItem("imageURL");
        const imageName = localStorage.getItem("imageName");
        if(imgURL && imageName) {
            setImgURL(imgURL);
            setImgName(imageName);
        }
            
    }, [imgURL]);


    return (
        <div className="h-[calc(100vh - 70px)]">
            {imgURL !== "" && <ImageCopper imgURL={imgURL} imageName={imgName}/>}
        </div>
    )
}
