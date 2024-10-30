'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { CalendarFoldIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
                const selectedProjectId = localStorage.getItem("selectedProjectId");
                if(selectedProjectId) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/assets/asset-project/${selectedProjectId}`);
                    const data = await response.json();
                    setImages(data.data);
                } else {
                    toast.error("No project selected");
                }
                
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
