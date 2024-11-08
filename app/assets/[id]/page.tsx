'use client'
import ImageCopper from "@/components/image-cropper";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export default function ImageCroppedPage(): JSX.Element {
    const [imgURL, setImgURL] = useState<string>("");

    useEffect(() => {
        const imgURL = localStorage.getItem("imageURL");
        if(imgURL)
            setImgURL(imgURL);
    }, [imgURL]);


    return (
        <>
            {imgURL !== "" && <ImageCopper imgURL={imgURL}/>}
        </>
    )
}
