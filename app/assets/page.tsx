'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { CalendarFoldIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ImageInterface {
    "id": string,
    "projectId": string,
    "projectName": string,
    "assestName": string,
    "type": string,
    "filePath": string,
    "dateCreated": string,
    "dateUdpated": string
}

export default function ImagePage() {
    const mount = useRef(false);
    const router = useRouter();
    const [images, setImages] = useState([] as ImageInterface[]);

    useEffect(() => {
        // Set page title
        document.title = "InSync - Assets Management";
        const fetchImageThroughAPI = async () => {
            try {
                const response = await fetch("https://in-sync-71cacf992634.herokuapp.com/api/assets/asset-project/21B012D5-2F45-4850-8DBB-43590DD7D750");
                const data = await response.json();
                setImages(data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchImageThroughAPI();

    }, [images]);

    const handleClick = (id: string, imgURL: string) => {
        localStorage.setItem("imageURL", imgURL);
        router?.push(`/assets/${id}`);
    }

    return (
        <div>
            {images.length == 0 ? <Skeleton /> :
                <div>
                    <div className="text-lg bg-[#f2f6fa] py-2 px-4">
                        <CalendarFoldIcon size="24" className="inline-block" />
                        <span className="mx-2">20/09/2023</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {images?.map((image, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-md">
                                <img
                                    key={i}
                                    onClick={() => handleClick(image.id, image.filePath)}
                                    alt="Collection of captured images"
                                    loading="lazy"
                                    decoding="async"
                                    data-nimg="1"
                                    className="h-[200px] w-auto object-cover transition-all hover:scale-105 aspect-[3/4]"
                                    src={image?.filePath}
                                    style={{ "color": "transparent" }}
                                />
                            </div>

                        ))}
                    </div>
                </div>
            }
        </div>
    )
}
