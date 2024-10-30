'use client'
import { useEffect, useRef, useState } from "react";
import { CropIcon, ImagesIcon, MoveIcon, UploadCloudIcon, XIcon, ZoomIn, ZoomOut } from "lucide-react";
import uploadImage from "../_components/uploadImage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * ImageCroppedPage component provides functionality for cropping and moving images on a canvas.
 * It allows users to zoom in and out, crop selected areas, and move the image within the canvas.
 * Users can also upload the cropped images.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <ImageCroppedPage />
 *
 * @remarks
 * This component uses several refs to manage DOM elements and state hooks to manage component state.
 * It includes event listeners for mouse and keyboard interactions to handle cropping and moving actions.
 *
 * @function
 * @name ImageCroppedPage
 *
 * @hook
 * @name useRef
 * @description Used to create references to DOM elements.
 *
 * @hook
 * @name useState
 * @description Used to manage component state.
 *
 * @hook
 * @name useEffect
 * @description Used to set up event listeners and perform cleanup.
 *
 * @event
 * @name click
 * @description Handles click events for cropping, moving, and selecting cropped images.
 *
 * @event
 * @name mousedown
 * @description Initiates drawing or moving actions based on the selected mode.
 *
 * @event
 * @name mousemove
 * @description Updates the canvas while drawing or moving.
 *
 * @event
 * @name mouseup
 * @description Finalizes the drawing action and stores the cropped rectangle.
 *
 * @event
 * @name keydown
 * @description Handles the Enter key to confirm cropping actions.
 *
 * @event
 * @name zoomIn
 * @description Zooms in the image on the canvas.
 *
 * @event
 * @name zoomOut
 * @description Zooms out the image on the canvas.
 *
 * @function
 * @name handleImageUpload
 * @description Handles the upload of cropped images.
 *
 * @param {HTMLCanvasElement} canvasRef - Reference to the canvas element.
 * @param {HTMLButtonElement} zoomInRef - Reference to the zoom in button.
 * @param {HTMLButtonElement} zoomOutRef - Reference to the zoom out button.
 * @param {HTMLDivElement} canvasAreaRef - Reference to the canvas area div.
 * @param {HTMLDivElement} pulseAreaRef - Reference to the pulse area div.
 * @param {HTMLButtonElement} uploadImageButtonRef - Reference to the upload image button.
 * @param {boolean} isMoving - State to track if the image is being moved.
 * @param {boolean} isCropping - State to track if the image is being cropped.
 * @param {HTMLButtonElement} croppingButtonRef - Reference to the cropping button.
 * @param {HTMLButtonElement} movingButtonRef - Reference to the moving button.
 * @param {Array<HTMLCanvasElement | null>} selectedImageCanvas - State to store selected cropped images.
 * @param {boolean} openPopup - State to manage the visibility of the popup.
 */


export default function ImageCroppedPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const zoomInRef = useRef<HTMLButtonElement>(null);
    const zoomOutRef = useRef<HTMLButtonElement>(null);
    const mount = useRef(false);
    const canvasAreaRef = useRef<HTMLDivElement>(null);
    const pulseAreaRef = useRef<HTMLDivElement>(null);
    const uploadImageButtonRef = useRef<HTMLButtonElement>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const croppingButtonRef = useRef<HTMLButtonElement>(null);
    const movingButtonRef = useRef<HTMLButtonElement>(null);
    const [selectedImageCanvas, setSelectedImageCanvas] = useState<Array<HTMLCanvasElement | null>>([]);
    const [openPopup, setOpenPopup] = useState(false);


    //#region useEffect
    useEffect(() => {
        if (mount.current) return;
        document.title = "InSync  - Asset Modification"
        const canvas = canvasRef.current;
        const fixedSizeCanvas = document.createElement('canvas');
        const fixedSizeCtx = fixedSizeCanvas.getContext('2d');
        const ctx = canvas?.getContext('2d');
        const canvasArea = canvasAreaRef.current;
        const pulseArea = pulseAreaRef.current;
        const uploadImageButton = uploadImageButtonRef.current;
        const movingButton = movingButtonRef.current;
        const croppingButton = croppingButtonRef.current;
        const totalImagesElement = document.getElementById('total-images');
        let centerMoveX = 0;
        let centerMoveY = 0;
        let isMovingButtonClicked = false;
        let isCroppingButtonClicked = false;
        let seletedCroppedImage: Array<HTMLCanvasElement>;
        let selectedRectIndex;
        let scale = 1;
        let imageX = 0;
        let imageY = 0;
        let totalImages = 0;

        // Initialize values 
        totalImagesElement?.parentElement?.classList.add('hidden');

        // Create a new image object
        const img = new Image();
        const fixedSizeImage = new Image();
        //#region declare fixed size image
        // Cài đặt hình ảnh cố định để cắt ảnh
        const imgURL = localStorage.getItem('imageURL')?.toString();
        console.log(`imgURL: ${imgURL}`);
        
        if (imgURL) {
            fixedSizeImage.src = imgURL; // Update with the path to your image
            img.src = imgURL;
        }
        fixedSizeImage.crossOrigin = "Anonymous";
        fixedSizeImage.onload = function () {
            fixedSizeCanvas.width = fixedSizeImage.width;
            fixedSizeCanvas.height = fixedSizeImage.height;
            fixedSizeCtx?.drawImage(fixedSizeImage, 0, 0, fixedSizeImage.width, fixedSizeImage.height);
            fixedSizeCanvas.classList.add('hidden');
        }
        canvasArea?.appendChild(fixedSizeCanvas);
        //#endregion

        // img.src = 'https://st.quantrimang.com/photos/image/2018/02/26/bat-thong-bao-khi-chia-se-hinh-anh-1.jpg'; // Update with the path to your image
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
                startX = e.offsetX;
                startY = e.offsetY;
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
                const currentX = e.offsetX;
                const currentY = e.offsetY;

                // Calculate width and height of the rectangle
                const width = currentX - startX;
                const height = currentY - startY;

                drawImageAndRectangles(ctx, canvas, img, rectangles);

                // Draw the new rectangle being created
                if (ctx) {
                    try {
                        ctx.beginPath();
                        console.log(`render rectangle: ${startX}, ${startY}, ${width}, ${height}`);

                        ctx.rect(startX, startY, width, height);
                        ctx.lineWidth = 2;
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
                imageX = (e.clientX - rect.left);
                imageY = (e.clientY - rect.top);
                centerMoveX = imageX - img.width / 2;
                centerMoveY = imageY - img.height / 2;

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
                let width = currentX - startX;
                let height = currentY - startY;
                const realStartX = startX - scale * centerMoveX;
                const realStartY = startY - scale * centerMoveY;
                rectangles.push({ startX, startY, realStartX, realStartY, width, height });
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
                    let imageData2 = fixedSizeCtx?.getImageData(rect.realStartX / scale, rect.realStartY / scale, rect.width / scale, rect.height / scale);
                    let imageData = ctx?.getImageData(rect.startX, rect.startY, rect.width, rect.height);
                    canvas.width = rect.width / scale;
                    canvas.height = rect.height / scale;
                    canvas.classList.add('shadow-gray-300', 'shadow-xl', 'cropped-canvas');
                    // add event listener to choose cropped image
                    canvas.addEventListener('click', () => {
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

                    // let imageData3 = fixedSizeCtx?.getImageData(82, 131, 58, 93);
                    if (imageData2) {
                        canvasContext?.putImageData(imageData2, 0, 0);

                        if (totalImagesElement) {
                            totalImagesElement.parentElement?.classList.remove('hidden');
                            totalImagesElement.textContent = `${++totalImages}`;
                        }

                    }
                    canvasArea?.appendChild(canvas);
                    rectangles.length = 0;
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
                ctx.scale(scale, scale);
                ctx.drawImage(img, centerMoveX, centerMoveY);
                // ctx.drawImage(img, imageX, imageY, img.width, img.height);
                ctx.restore();
            }
        };

        //#region declare zoom function
        const zoomInButton = zoomInRef.current;
        const zoomOutButton = zoomOutRef.current;
        // Zoom in Zoom out function
        zoomInButton?.addEventListener('click', (e) => {
            scale += 0.1;
            if (ctx && canvas && img) {
                rectangles.length = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawImage(ctx, canvas, img);
            }

        });

        zoomOutButton?.addEventListener('click', (e) => {
            scale -= 0.1;
            if (ctx && canvas && img) {
                rectangles.length = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawImage(ctx, canvas, img);
            }

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


        // Cleanup function
        return () => { mount.current = true; };
    }, []);

    //#endregion

    //#region handleImageUpload
    const handleImageUpload = async () => {
        try {
            selectedImageCanvas.forEach(async (image) => {
                const uploadImageString = image?.toDataURL();
                if (uploadImageString) {
                    uploadImage(uploadImageString.toString());
                    toast.success("Image uploaded successfully");
                }
            }); // <-- Add this closing parenthesis
        } catch (error) {
            console.error(error);
        }
    };
    //#endregion

    return (
        <div>
            <div className="p-5 flex justify-center">
                <div className=" border-[1px] 
                        border-[#e6e6e8] 
                            rounded-md">
                    <div className="flex justify-between border-b-[1px] text-xl border-[#e6e6e8] p-[10px] ">
                        <span className="font-semibold">Assets Modifier</span>
                        <div className="flex gap-5">
                            <button
                                className="hover:border-2 hover:border-black px-2 rounded-sm relative"
                            >
                                <ImagesIcon
                                    onClick={() => setOpenPopup(!openPopup)}
                                    className="relative"
                                    size={20} />
                                <span className="absolute flex items-center justify-center top-[-5px] left-[-5px] w-[20px] h-[20px] p-[1px] text-[14px] text-white text-center rounded-xl bg-red-700">
                                    <span id="total-images">0</span>
                                </span>
                            </button>
                            <button
                                ref={croppingButtonRef}
                                onClick={() => { setIsCropping(!isCropping); setIsMoving(false) }}
                                className={`${isCropping ? "bg-gray-400" : ""} hover:border-2 hover:border-black rounded-sm px-2`}
                            >
                                <CropIcon size={20} />
                            </button>
                            <button
                                ref={movingButtonRef}
                                onClick={() => { setIsMoving(!isMoving); setIsCropping(false) }}
                                className={`${isMoving ? "bg-gray-400" : ""} hover:border-2 hover:border-black px-2 rounded-sm`}>
                                <MoveIcon size={20} />
                            </button>
                            <button
                                ref={zoomInRef}
                                className="hover:border-2 hover:border-black px-2 rounded-sm">
                                <ZoomIn size={20} />
                            </button>
                            <button
                                ref={zoomOutRef} className="hover:border-2 hover:border-black px-2 rounded-sm">
                                <ZoomOut size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="relative flex max-w-[1000px] max-h-[800px] p-[30px]">
                        <canvas
                            ref={canvasRef}
                            width="900"
                            height="600"
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
                        <div ref={pulseAreaRef} className="w-[900px] h-[600px] bg-white bg-opacity-45 absolute text-4xl flex items-center justify-center animate-pulse "><span>Click to crop</span></div>
                    </div>


                </div>

            </div>
            <div
                className={`popup flex items-center fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 ${openPopup ? 'block' : 'hidden'}`}
            >
                <div className="popup-content bg-white w-[500px] h-[500px] max-h-[600px] m-auto p-5 rounded-md">
                    <div className="flex justify-between max-h-[500px]">
                        <span className="font-semibold">Choose image to upload</span>
                        <button className="hover:border-2 hover:border-black px-2 rounded-sm">
                            <XIcon size={20} onClick={() => setOpenPopup(false)} />
                        </button>
                    </div>
                    <div className="p-5 relative h-full w-full">
                        <div ref={canvasAreaRef} className="flex items-start flex-wrap gap-1 max-h-[380px] overflow-y-auto"></div>
                        <div className="flex justify-center w-full absolute bottom-5 ">
                            <Button
                                variant={"default"}
                                size={"lg"}
                                onClick={() => handleImageUpload()}
                                ref={uploadImageButtonRef}
                                className="hidden"
                            >
                                <UploadCloudIcon className="inline-block" size={20} /> <span>Upload Image</span>
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
