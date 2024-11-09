'use client'

import { Loading } from "@/components/loading";
import { ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon, EllipsisVerticalIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ImageInterface {
    "id": string,
    "projectId": string,
    "projectName": string,
    "assetName": string,
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
        assetName: string;
        type: string;
        filePath: string;
        dateUpdated: string;
    }[];
}

export default function ImagePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [images, setImages] = useState<GroupedImagesByDate>({});
    const [searchKey, setSearchKey] = useState("");
    const [isReverse, setIsReverse] = useState(false);
    const [notFound, setNotFound] = useState(false);  

    useEffect(() => {
        // Set page title
        document.title = "InSync - Assets Management";
        const search = searchParams.get('search');
        setSearchKey(search || "");


        function formatDate(dateString: string) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
        }

        function groupImagesByDate(images: ImageInterface[]): GroupedImagesByDate {
            const grouped = images.reduce((acc: GroupedImagesByDate, image) => {
                let { dateCreated, id, projectId, projectName, assetName, type, filePath, dateUpdated } = image;
                dateCreated = formatDate(dateCreated);
                if (!acc[dateCreated]) {
                    acc[dateCreated] = [];
                }

                acc[dateCreated].push({
                    id,
                    projectId,
                    projectName,
                    assetName,
                    type,
                    filePath,
                    dateUpdated,
                });

                return acc;
            }, {});

            // Sort the grouped images by date in ascending order
            return Object.keys(grouped).sort((a, b) => {
                const [dayA, monthA, yearA] = a.split('-').map(Number);
                const [dayB, monthB, yearB] = b.split('-').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateA.getTime() - dateB.getTime();
            }).reduce((acc: GroupedImagesByDate, date) => {
                acc[date] = grouped[date];
                return acc;
            }, {});
        }

        const loading = `
            <div class='animate-pulse flex space-x-4'>
                <div class='flex-1 space-y-4 py-1'>
                    <div class='h-4 bg-gray-200 rounded w-3/4'></div>
                    <div class='space-y-2'>
                        <div class='h-4 bg-gray-200 rounded'></div>
                        <div class='h-4 bg-gray-200 rounded w-5/6'></div>
                    </div>
                </div>
            </div>`;


        const fetchImageThroughAPI = async () => {
            try {
                const selectedProjectId = localStorage.getItem("selectedProjectId");
                if (selectedProjectId) {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/assets/asset-project/${selectedProjectId}`)
                        .then(res => res.json()).then(data => {
                            setImages(groupImagesByDate(data.data))
                        }).catch(err => console.log(err));
                } else {
                    toast.error("No project selected");
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchImageThroughAPI();

        setTimeout(() => {
            setNotFound(true);
        }, 10000);

    }, [searchParams, images]);

    const renderImages = (images: GroupedImagesByDate) => {

        const filteredImagesByNameFunction = (img: GroupedImagesByDate) => Object.keys(img).reduce((acc: GroupedImagesByDate, date: string) => {
            const filteredImages = img[date].filter(image => image.assetName?.toLowerCase().includes(searchKey.toLowerCase()));
            if (filteredImages?.length > 0) {
                acc[date] = filteredImages;
            }
            if (isReverse && acc[date]?.length > 1) {
                // Sort the grouped images by date in descending order
                return Object.keys(img).sort((a, b) => {
                    const [dayA, monthA, yearA] = a.split('-').map(Number);
                    const [dayB, monthB, yearB] = b.split('-').map(Number);
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    return dateB.getTime() - dateA.getTime();
                }).reduce((acc: GroupedImagesByDate, date) => {
                    acc[date] = img[date];
                    return acc;
                }, {});
            }
            return acc;
        }, {});

        let filteredImagesByDate = filteredImagesByNameFunction(images);

        const handleAction = (e: React.MouseEvent<SVGSVGElement>) => {
            const element = e.currentTarget as SVGSVGElement;
            const settings = document.querySelectorAll('.settings');
            const settingList = document.querySelectorAll('.setting-list');
            settings.forEach((setting, index) => {
                if (setting === element) {
                    settingList[index].classList.toggle('hidden');

                }
            });
        };

        /**
         * @description Delete image
         * @param e 
         * @param dateCreated 
         */
        const handleDelete = (e: React.MouseEvent<HTMLLIElement>, dateCreated: string) => {
            const element = e.currentTarget as HTMLLIElement;
            element.parentElement?.classList.contains('hidden') ? element.parentElement?.classList.remove('hidden') : element.parentElement?.classList.add('hidden');

            try {
                let deleteSettings = document.querySelectorAll(`.date-${dateCreated}`);

                deleteSettings.forEach((setting, index) => {
                    if (setting === element) {
                        const imageArray = images[dateCreated];
                        if (imageArray && imageArray[index]) {
                            const assetId = imageArray[index].id;
                            if (assetId) {
                                fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/assets/${assetId}`, { method: "DELETE" })
                                    .then(res => {
                                        if (res.status === 200) {
                                            const updatedImages = images[dateCreated].filter((_, i) => i !== index);
                                            setImages(prevImages => ({
                                                ...prevImages,
                                                [dateCreated]: updatedImages
                                            }));
                                            toast.success("Image deleted successfully");
                                        } else {
                                            toast.error("Failed to delete image");
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        toast.error("An error occurred while deleting image");
                                    });
                            }
                        }
                    }

                });
            } catch (error) {
                console.log(error);
                toast.error("An error occurred while deleting image");
            } finally {
                element.parentElement?.classList.remove('hidden');
            }
        }



        return (
            <div className="px-10 py-5 max-w-[1500px] image-loading">
                {Object.keys(filteredImagesByDate).length === 0 ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <div className="text-center">
                            <img src="/logo.svg" alt="No assets found" className="w-[200px] h-[200px] mx-auto animate-pulse" />
                            <h1 className="text-2xl">Assest - Insync</h1>
                            <p className="text-muted-foreground">{notFound ?'Asset is not found' : 'Powered by InSync' }</p>
                        </div>
                    </div>
                ) :
                    <div className="relative">
                        <div className="flex absolute top-0 right-0 justify-end">
                            <div
                                role="tablist"
                                aria-orientation="horizontal"
                                className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
                                tabIndex={0}
                                data-orientation="horizontal"
                                style={{ "outline": "none" }}>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected="false"
                                    aria-controls="radix-:r6j:-content-podcasts"
                                    data-state="inactive" id="radix-:r6j:-trigger-podcasts"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                                    tabIndex={-1}
                                    data-orientation="horizontal"
                                    data-radix-collection-item="">Date</button>
                                <button
                                    type="button"
                                    role="tab"
                                    onClick={() => { setIsReverse(!isReverse) }}
                                    aria-selected="true"
                                    aria-controls="radix-:r6j:-content-music"
                                    data-state="active" id="radix-:r6j:-trigger-music"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow relative"
                                    tabIndex={0}
                                    data-orientation="horizontal"
                                    data-radix-collection-item="">{isReverse ? <ArrowDownWideNarrowIcon size={15} /> : <ArrowUpWideNarrowIcon size={15} />}</button>

                            </div>
                        </div>
                        {Object.keys(filteredImagesByDate)?.map((dateCreated, i) => (
                            <div key={i}>
                                {
                                    <div className="flex items-center justify-between my-2">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-semibold tracking-tight">{dateCreated}</h2>
                                            <p className="text-sm text-muted-foreground">Powered by InSync</p>
                                        </div>
                                    </div>
                                }
                                <div className="flex flex-wrap gap-[2px]">
                                    {filteredImagesByDate[dateCreated].map((image, index) => (
                                        <div
                                            key={index}
                                            className="overflow-hidden relative">
                                            <img
                                                onClick={() => handleClick(image.id, image.filePath)}
                                                alt="Collection of captured images"
                                                loading="lazy"
                                                decoding="async"
                                                data-nimg="1"
                                                className="h-[200px] w-auto object-cover transition-all hover:scale-105 aspect-[3/4]"
                                                src={image?.filePath}
                                                style={{ "color": "transparent" }}
                                            />
                                            <div
                                                key={index}
                                                className="rounded-xl bg-white absolute top-2 right-2 p-[7px]">
                                                <div className="relative">
                                                    <EllipsisVerticalIcon
                                                        className="settings"
                                                        onClick={(e) => { handleAction(e) }}
                                                        size={15} />
                                                    <span className="bg-white hidden w-auto h-auto setting-list absolute top-2 right-2 cursor-pointer">
                                                        <ul className="list-none">
                                                            <li className="hover:bg-gray-100 p-2"><button>Rename</button></li>
                                                            <li
                                                                className={`hover:bg-gray-100 p-2 date-${dateCreated}`}
                                                                onClick={(e) => { handleDelete(e, dateCreated) }}
                                                            ><button>Delete</button></li>
                                                        </ul>
                                                    </span>
                                                </div>

                                            </div>
                                        </div>))}
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        );
    };

    const handleClick = (id: string, imgURL: string) => {
        localStorage.setItem("imageURL", imgURL);
        router?.push(`/assets/${id}`);
    }

    return (
        renderImages(images)
    )
}
