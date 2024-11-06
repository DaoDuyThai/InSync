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
    "dateUpdated": string
}

interface GroupedImagesByDate {
    [dateCreated: string]: {
        id: string;
        projectId: string;
        projectName: string;
        assestName: string;
        type: string;
        filePath: string;
        dateUpdated: string;
    }[];
}


export default function ImagePage() {
    const router = useRouter();
    const [images, setImages] = useState<GroupedImagesByDate>({});
    const [date, setDate] = useState(true);


    useEffect(() => {
        // Set page title
        document.title = "InSync - Assets Management";

        function formatDate(dateString: string) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
        }

        function groupImagesByDate(images: ImageInterface[]): GroupedImagesByDate {
            return images.reduce((acc: GroupedImagesByDate, image) => {
                let { dateCreated, id, projectId, projectName, assestName, type, filePath, dateUpdated } = image;
                dateCreated = formatDate(dateCreated);
                if (!acc[dateCreated]) {
                    acc[dateCreated] = [];
                }

                acc[dateCreated].push({
                    id,
                    projectId,
                    projectName,
                    assestName,
                    type,
                    filePath,
                    dateUpdated,
                });

                return acc;
            }, {});
        }

        const fetchImageThroughAPI = async () => {
            try {
                const selectedProjectId = localStorage.getItem("selectedProjectId");
                if (selectedProjectId) {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/assets/asset-project/${selectedProjectId}`)
                        .then(res => res.json()).then(data => setImages(groupImagesByDate(data.data))).catch(err => console.log(err));
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
            {Object.keys(images).length == 0 ? <Skeleton /> :
                <div>
                        {Object.keys(images)?.map((dateCreated, i) => (
                            <div>
                                {date && <div className="text-lg py-2 px-4">
                                    <CalendarFoldIcon size="24" className="inline-block" />
                                    {/* {images?.map((image, index) => {})} */}
                                    <span className="mx-2">{dateCreated}</span>
                                </div>}
                                <div className="flex flex-wrap gap-2">
                                    {images[dateCreated].map((image, index) => (
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
                                        </div>))}
                                </div>
                            </div>

                        ))}
                    </div>
            }
        </div>
    )
}
