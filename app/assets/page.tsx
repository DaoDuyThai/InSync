'use client'

import { ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon, EllipsisVerticalIcon, FilePenLine, LucideCirclePlus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import uploadImage from "./_components/uploadImage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/confirm-modal";


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
    const [projectId, setProjectId] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openRenameAssetDialog, setOpenRenameAssetDialog] = useState<boolean>(false);
    const [loadingAssetRenameInput, setLoadingAssetRenameInput] = useState<boolean>(false);
    const [assetName, setAssetName] = useState<string>("");
    const [assetId, setAssetId] = useState<string>("");
    const [newAssetName, setNewAssetName] = useState<string>("");

    useEffect(() => {
        // Set page title
        document.title = "InSync - Assets Management";
        const search = searchParams ? searchParams.get('search') : "";
        const id = localStorage.getItem("selectedProjectId");
        setProjectId(id || "");
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
                return dateB.getTime() - dateA.getTime();
            }).reduce((acc: GroupedImagesByDate, date) => {
                acc[date] = grouped[date];
                return acc;
            }, {});
        }


        const fetchImageThroughAPI = async () => {
            try {
                const selectedProjectId = localStorage.getItem("selectedProjectId");
                if (selectedProjectId) {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/assets/asset-project/${selectedProjectId}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY!}`,
                            }
                        }
                    )
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
                    return dateA.getTime() - dateB.getTime();
                }).reduce((acc: GroupedImagesByDate, date) => {
                    acc[date] = img[date];
                    return acc;
                }, {});
            }
            return acc;
        }, {});

        let filteredImagesByDate = filteredImagesByNameFunction(images);

        const handleDeleteAsset = (id: string, dateCreated: string) => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/assets/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                },

            )
                .then(res => {
                    if (res.status === 200) {
                        const updatedImages = images[dateCreated].filter((image, i) => image.id !== id);
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
                    toast.error("An error occurred while deleting asset");
                });
        }

        const handleOpenModal = () => {
            setOpenModal(true);
        }

        const handleUpload = (e: ChangeEvent) => {
            e.preventDefault();
            try {
                const imageData = e.target as HTMLInputElement;
                const file = imageData.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        const base64Image = reader.result?.toString();
                        if (base64Image) {
                            uploadImage(base64Image);
                            toast.success("Image uploaded successfully");
                            setOpenModal(false);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        const handleClickUploadButton = (e: MouseEvent) => {
            e.preventDefault();
            const uploadImage = document.querySelector('#file-upload');
            if (uploadImage) {
                (uploadImage as HTMLInputElement).click();
            }
        }

        const handleRenameAsset = (assetName: string, assetId: string) => {
            setAssetName(assetName);
            setAssetId(assetId);
            setOpenRenameAssetDialog(true);
        }

        const handleRenameRequest = (e: MouseEvent) => {
            e.preventDefault();
            if (newAssetName === "") {
                toast.error("Asset name cannot be empty");
                return;
            }
            fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/assets/${assetId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY!}`,
                },
                body: JSON.stringify({
                    assetName: newAssetName, // Assuming newAssetName is a state variable or a ref for the new name
                    id: assetId,
                    type: "image",
                })
            }).then(res => {
                if (res.status === 200) {
                    toast.success("Asset renamed successfully");
                    setOpenRenameAssetDialog(false);
                } else {
                    toast.error("Failed to rename asset");
                    console.log(res.body);

                }
            }).catch(err => {
                console.log(err);
                toast.error("An error occurred while renaming asset");
                setLoadingAssetRenameInput(false);
            });
        }


        return (
            <div className="px-10 py-5 h-[calc(100vh - 100px)] image-loading">
                {openModal &&
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="bg-white w-[600px] h-[600px] rounded-lg z-50">
                            <div className="p-4 relative">
                                <div className="absolute top-0 right-0 p-4">
                                    <button onClick={() => setOpenModal(false)} className="text-2xl font-semibold">&times;</button>
                                </div>
                                <h2 className="text-xl text-center font-semibold mb-4">Upload New Asset</h2>
                                <form>
                                    <div className="mb-4 flex flex-col items-center justify-center">
                                        <div className="w-[450px] h-[450px] ">
                                            <img className="w-full h-full" src="upload.svg" alt="upload-image" />
                                        </div>
                                    </div>
                                    <div className="mb-4 hidden">
                                        <input
                                            id="file-upload"
                                            onChange={(e) => handleUpload(e)}
                                            type="file"
                                            accept="image/*"
                                            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            onClick={(e) => handleClickUploadButton(e)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Upload
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                {openRenameAssetDialog &&
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="bg-white w-auto h-auto rounded-lg z-50">
                            <div className="p-4 relative">
                                <div className="absolute top-0 right-0">
                                    <button onClick={() => setOpenRenameAssetDialog(false)} className="text-2xl font-semibold mx-5">&times;</button>
                                </div>

                                <form className="w-[400px] px-5">
                                    <h2 className="text-xl text-center font-semibold mb-4">Rename Asset</h2>
                                    <div className="mb-4">
                                        <input
                                            onChange={(e) => setNewAssetName(e.target.value)}
                                            placeholder={assetName}
                                            type="text"
                                            className="p-5 mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            onClick={(e) => { handleRenameRequest(e) }}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Rename
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                {Object.keys(filteredImagesByDate).length === 0 ? (
                    <div className="h-calc(100vh - 100px)">
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center 
                        justify-center gap-2 whitespace-nowrap 
                        rounded-md text-sm font-medium transition-colors 
                        focus-visible:outline-none focus-visible:ring-1 
                        focus-visible:ring-ring disabled:pointer-events-none 
                        disabled:opacity-50 [&amp;_svg]:pointer-events-none 
                        [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary 
                        text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                                Add asset</button>
                        </div>
                        <div className="flex justify-center items-center h-[calc(100vh - 100px)] w-aut">
                            <div className="text-center">
                                <img src="/loading-asset.svg" alt="No assets found" className="w-auto h-[300px] mx-auto" />
                                <h1 className="text-2xl">Assest - Insync</h1>
                                <p className="text-muted-foreground">{notFound ? 'Asset is not found' : 'Powered by InSync'}</p>
                            </div>
                        </div>
                    </div>
                ) :
                    <div className="relative">

                        <div className="flex gap-2 absolute top-0 right-0 justify-end">
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center 
                                justify-center gap-2 whitespace-nowrap 
                                rounded-md text-sm font-medium transition-colors 
                                focus-visible:outline-none focus-visible:ring-1 
                                focus-visible:ring-ring disabled:pointer-events-none 
                                disabled:opacity-50 [&amp;_svg]:pointer-events-none 
                                [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary 
                                text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    className="lucide lucide-circle-plus ">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M8 12h8"></path><path d="M12 8v8"></path>
                                </svg>Add asset</button>
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
                                            <h2 className="text-2xl 2xl:text-5xl font-semibold tracking-tight">{dateCreated}</h2>
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
                                                className="h-[calc(20vh)] w-auto object-cover transition-all hover:scale-105 aspect-[3/4]"
                                                src={image?.filePath}
                                                style={{ "color": "transparent" }}
                                            />
                                            <div className="absolute top-0 right-0 p-2 z-10 round-lg">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button className="rounded-full" variant="ghost" size="sm" aria-label="More options">
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-full h-full bg-white">
                                                        <DropdownMenuLabel className="flex justify-center ">
                                                            {image.assetName}
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild className="w-full h-full bg-white">
                                                            <Dialog
                                                                open={openRenameAssetDialog}
                                                                onOpenChange={setOpenRenameAssetDialog}
                                                            >
                                                                <Button
                                                                    onClick={() => { handleRenameAsset(image.assetName, image.id) }}
                                                                    className="w-full" variant="ghost" size="sm" aria-label="Rename">
                                                                    <Pencil className="h-4 w-4 mr-4" />Rename
                                                                </Button>
                                                            </Dialog>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="w-full h-full">
                                                            <ConfirmModal
                                                                header="Delete Asset?"
                                                                description="This will delete the asset from the database."
                                                                onConfirm={() => {
                                                                    handleDeleteAsset(image.id, dateCreated);
                                                                }}>
                                                                <Button className="w-full" variant="ghost" size="sm" aria-label="Delete">
                                                                    <Trash2 className="h-4 w-4 mr-4" />Delete
                                                                </Button>
                                                            </ConfirmModal>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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

