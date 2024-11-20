'use client'
import ImageCopper from "@/components/image-cropper";
import { useEffect, useState } from "react";



export default function ImageCroppedPage(): JSX.Element {
    const [imgURL, setImgURL] = useState<string>("");

    useEffect(() => {
        const imgURL = localStorage.getItem("imageURL");
        if(imgURL)
            setImgURL(imgURL);
    }, [imgURL]);


    return (
        <div className="h-[calc(100vh - 70px)]">
            {imgURL !== "" && <ImageCopper imgURL={imgURL} />}
        </div>
    )
}
