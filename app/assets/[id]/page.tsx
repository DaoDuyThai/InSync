'use client'
import { useEffect, useRef, useState } from "react";
import { CropIcon, MoveIcon, UploadCloudIcon, ZoomIn, ZoomOut } from "lucide-react";
import { useParams } from "next/navigation";
import uploadImage from "../_components/uploadImage";

export default function ImageCroppedPage() {
    const { id } = useParams();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const zoomInRef = useRef<HTMLButtonElement>(null);
    const zoomOutRef = useRef<HTMLButtonElement>(null);
    const croppedRef = useRef<HTMLCanvasElement>(null);
    const mount = useRef(false);
    const canvasAreaRef = useRef<HTMLDivElement>(null);
    const pulseAreaRef = useRef<HTMLDivElement>(null);
    const uploadImageButtonRef = useRef<HTMLButtonElement>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const croppingButtonRef = useRef<HTMLButtonElement>(null);
    const movingButtonRef = useRef<HTMLButtonElement>(null);
    const [selectedImageCanvas, setSelectedImageCanvas] = useState<Array<HTMLCanvasElement | null>>([]);

    //#region useEffect
    useEffect(() => {

        if (!mount.current) {
            // Get the canvas and its context
            // Declare global variables
            document.title = "InSync  - Asset Modification"
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            const croppedCanvas = croppedRef.current;
            const croppedCtx = croppedCanvas?.getContext('2d');
            const canvasArea = canvasAreaRef.current;
            const pulseArea = pulseAreaRef.current;
            const uploadImageButton = uploadImageButtonRef.current;
            const movingButton = movingButtonRef.current;
            const croppingButton = croppingButtonRef.current;
            let isMovingButtonClicked = false;
            let isCroppingButtonClicked = false;
            let seletedCroppedImage: Array<HTMLCanvasElement>;
            let selectedRectIndex;
            let scale = 1;
            let imageX = 0;
            let imageY = 0;

            // Create a new image object
            const img = new Image();
            img.src = 'https://st.quantrimang.com/photos/image/2018/02/26/bat-thong-bao-khi-chia-se-hinh-anh-1.jpg'; // Update with the path to your image

            // Array to store rectangles
            const rectangles: Array<any> = [];

            // Variables to track rectangle drawing
            let startX: number, startY: number;
            let isDrawing = false;

            // Draw the image on the canvas once it's loaded
            img.crossOrigin = "Anonymous";
            img.onload = function () {
                drawImageAndRectangles(ctx, canvas, img, rectangles);
            };

            croppingButton?.addEventListener('click', e => {
                isCroppingButtonClicked = true;
                isMovingButtonClicked = false;
            })

            movingButton?.addEventListener('click', (e) => {
                console.log("IsMovingButtonClicked is listened");
                isMovingButtonClicked = true;
                isCroppingButtonClicked = false;
            })


            // Function to start drawing
            canvas?.addEventListener('mousedown', (e) => {
                if (isCroppingButtonClicked) {
                    console.log("isCroppingButtonClicked")
                    const rect = canvas.getBoundingClientRect();
                    startX = e.clientX - rect.left;
                    startY = e.clientY - rect.top;
                    isDrawing = true;
                } else if (isMovingButtonClicked) {
                    console.log("isMovingButtonClicked")
                    isDrawing = true;
                }
            });

            // Function to draw the rectangle while mouse is moving
            canvas?.addEventListener('mousemove', (e) => {
                if (!isDrawing) return;
                if (isCroppingButtonClicked) {
                    // Calculate the current mouse position
                    console.log("mousemove in Cropping is working!");

                    const rect = canvas.getBoundingClientRect();
                    const currentX = e.clientX - rect.left;
                    const currentY = e.clientY - rect.top;

                    // Calculate width and height of the rectangle
                    const width = currentX - startX;
                    const height = currentY - startY;

                    // Clear the canvas and redraw the image and existing rectangles
                    console.log("second ImageX: ", imageX, "second ImageY: ", imageY);

                    drawImageAndRectangles(ctx, canvas, img, rectangles);

                    // Draw the new rectangle being created
                    if (ctx) {
                        try {
                            ctx.beginPath();
                            ctx.rect(startX, startY, width, height);
                            ctx.lineWidth = 3;
                            ctx.strokeStyle = 'white';
                            ctx.stroke();
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
                else if (isMovingButtonClicked) {
                    console.log("is moving");
                    const rect = canvas.getBoundingClientRect();
                    imageX = e.clientX - rect.left - img.width / 2;
                    imageY = e.clientY - rect.top - img.height / 2;

                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                    if (ctx) {
                        drawImage(ctx, canvas, img);
                    }
                    rectangles.length = 0;
                }
            });

            // Function to finish drawing the rectangle
            canvas?.addEventListener('mouseup', (e) => {
                if (isCroppingButtonClicked && isDrawing) {
                    const rect = canvas.getBoundingClientRect();
                    const currentX = e.clientX - rect.left;
                    const currentY = e.clientY - rect.top;
                    // Calculate width and height of the rectangle
                    const width = currentX - startX;
                    const height = currentY - startY;
                    // Add the new rectangle to the array
                    rectangles.push({ startX, startY, width, height });
                    console.log(rectangles);
                    // Reset drawing state
                    isDrawing = false;
                    // Redraw everything
                    drawImageAndRectangles(ctx, canvas, img, rectangles);
                }
            });

            // Add an event listener to crop the most recent rectangle
            document.addEventListener('keydown', (e) => {
                try {
                    if (isCroppingButtonClicked && e.key === 'Enter') {
                        let length = rectangles.length
                        const rect = rectangles[length - 1]
                        let canvas = document.createElement("canvas");
                        let canvasContext = canvas.getContext('2d');
                        let imageData = ctx?.getImageData(rect.startX, rect.startY, rect.width, rect.height);
                        canvas.width = rect.width;
                        canvas.height = rect.height;
                        canvas.classList.add('shadow-gray-300', 'shadow-xl', 'border-2', 'border-black', 'rounded-md', 'm-2', 'cropped-canvas');
                        // add event listener to choose cropped image
                        canvas.addEventListener('click', (e) => {
                            canvas.classList.toggle('border-4');
                            canvas.classList.toggle('border-green-500');
                            canvas.classList.toggle('selected-cropped-image');
                            seletedCroppedImage = Array.from(document.querySelectorAll<HTMLCanvasElement>('.selected-cropped-image'));
                            if (seletedCroppedImage.length >= 1) {
                                uploadImageButton?.classList.remove('hidden');
                                setSelectedImageCanvas(Array.from(seletedCroppedImage));
                            } else {
                                uploadImageButton?.classList.add('hidden');
                                setSelectedImageCanvas([]);
                            }

                        });

                        if (imageData) {
                            canvasContext?.putImageData(imageData, 0, 0);
                        }
                        canvasArea?.appendChild(canvas);
                    }
                } catch (error) {
                    console.error(error);

                }
            });

            pulseArea?.addEventListener('click', (e) => {
                if (pulseArea) {
                    pulseArea.style.display = 'none';
                }
            });


            canvas?.addEventListener('click', (e) => {
                if (isCroppingButtonClicked) {
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    selectedRectIndex = null; // Reset selected rectangle
                    rectangles.forEach((rect, index) => {
                        if (mouseX >= rect.startX && mouseX < rect.startX + rect.width &&
                            mouseY >= rect.startY && mouseY < rect.startY + rect.height) {
                            selectedRectIndex = index;
                        }
                    });

                    if (selectedRectIndex !== null) {
                        // Confirm removal of the selected rectangle
                        const confirmed = confirm('Do you want to remove the selected rectangle?');
                        if (confirmed) {
                            // Remove the selected rectangle
                            rectangles.splice(selectedRectIndex, 1);
                            selectedRectIndex = null;
                            drawImageAndRectangles(ctx, canvas, img, rectangles);
                        }
                    }
                } else if (isMovingButtonClicked) {
                    isMovingButtonClicked = false;
                } else if (!isMovingButtonClicked) {
                    isMovingButtonClicked = true;
                }
            });

            const drawImage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
                if (ctx && canvas) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.save();
                    // ctx.translate(0, 0);
                    ctx.scale(scale, scale);
                    ctx.drawImage(img, imageX, imageY, img.width, img.height);
                    console.log("ImageX: ", imageX, "ImageY: ", imageY);

                    ctx.restore();
                }
            };

            //#region declare zoom function
            const zoomInButton = zoomInRef.current;
            const zoomOutButton = zoomOutRef.current;
            // Zoom in Zoom out function
            zoomInButton?.addEventListener('click', (e) => {
                scale += 0.1;
                if (ctx && canvas && img)
                    drawImage(ctx, canvas, img);
            });

            zoomOutButton?.addEventListener('click', (e) => {
                scale -= 0.1;
                if (ctx && canvas && img)
                    drawImage(ctx, canvas, img);
            });
            //#endregion

            // Function to draw image and rectangles
            const drawImageAndRectangles = (ctx: any, canvas: any, img: any, rectangles: Array<any>) => {
                if (ctx && canvas) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawImage(ctx, canvas, img);
                    // Draw all rectangles
                    rectangles?.forEach(rect => {
                        ctx.beginPath();
                        ctx.rect(rect.startX, rect.startY, rect.width, rect.height);
                        ctx.strokeStyle = 'white';
                        ctx.stroke();
                    });
                }
            }

        }



        return () => {
            mount.current = true;
        }
    }, [])
    //#endregion

    //#region handleImageUpload
    const handleImageUpload = async () => {
        try {
            selectedImageCanvas.forEach(async (image) => {
                const uploadImageString = image?.toDataURL();
                if (uploadImageString) {
                    uploadImage(uploadImageString.toString());
                }
            }); // <-- Add this closing parenthesis
        } catch (error) {
            console.error(error);
        }
    };
    //#endregion

    return (
        <div className="p-5 flex justify-center">
            <div className=" border-[1px] 
                         border-[#e6e6e8] ">
                <div className="border-b-[1px] text-xl border-[#e6e6e8] p-[10px] font-semibold ">Image Cropper</div>
                <div className="relative flex max-w-[1000px] max-h-[680px] p-[30px]">
                    <canvas
                        ref={canvasRef}
                        width="900"
                        height="680"
                        className
                        ="shadow-gray-100
                         shadow-sm border-[1px] 
                         border-[#e6e6e8] 
                         rounded-md 
                         relative 
                         bg-gray-100
                         "
                    >
                    </canvas>
                    <div className="absolute top-10 right-10">
                        <button ref={croppingButtonRef} onClick={() => { setIsCropping(!isCropping); setIsMoving(false) }} className={`${isCropping ? "bg-gray-400" : ""} hover:border-2 hover:border-black px-5 py-2 bg-gray-200 border-r-2 border-black`}><CropIcon size={24} /></button>
                        <button ref={movingButtonRef} onClick={() => { setIsMoving(!isMoving); setIsCropping(false) }} className={`${isMoving ? "bg-gray-400" : ""} hover:border-2 hover:border-black px-5 py-2 bg-gray-200`}><MoveIcon size={24} /></button>
                    </div>
                    <div className="absolute bottom-10 right-10">
                        <button ref={zoomInRef} className="px-5 py-2 bg-gray-200 border-r-2 border-black"><ZoomIn size={24} /></button>
                        <button ref={zoomOutRef} className="px-5 py-2 bg-gray-200"><ZoomOut size={24} /></button>
                    </div>
                    <div ref={pulseAreaRef} className="w-[900px] h-[600px] bg-white bg-opacity-45 absolute text-4xl flex items-center justify-center animate-pulse "><span>Click to crop</span></div>
                </div>


            </div>
            <div className="p-5">
                <div ref={canvasAreaRef} className="overflow-y-auto mx-auto h-[600px] max-h-[600px] flex flex-col items-start"></div>
                <div className="flex justify-center">
                    <button onClick={() => handleImageUpload()} ref={uploadImageButtonRef} className="border-2 bg-green-600 px-5 py-5 text-lg rounded-lg hidden" >
                        <UploadCloudIcon className="inline-block" size={20} /> <span>Upload Image</span>
                    </button>
                </div>

            </div>
        </div>
    )
}
