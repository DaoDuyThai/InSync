'use client'
import ImageCopper from "@/components/image-cropper";
import { useEffect, useState } from "react";


export default function ImageCroppedPage(): JSX.Element {
    const [imgURL, setImgURL] = useState<string>(localStorage.getItem("imageURL") || "");

    return (
        <ImageCopper imgURL={imgURL}/>
    )
} 1
