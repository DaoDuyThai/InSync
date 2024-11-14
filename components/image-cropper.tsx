'use client'
import { useEffect, useRef, useState } from "react";
import { CropIcon, ImagesIcon, MoveIcon, RadarIcon, SaveIcon, UploadCloudIcon, XIcon, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import uploadImage from "@/app/assets/_components/uploadImage";
import { Hint } from "./hint";

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

interface props {
    id?: string;
    imgURL?: string;
    className?: string;
}

export default function ImageCopper({ id, imgURL, className }: props): JSX.Element {
    // const {id} = useParams();
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
    const saveButtonRef = useRef<HTMLButtonElement>(null);
    const radarButtonRef = useRef<HTMLButtonElement>(null);
    const [isRadar, setIsRadar] = useState(false);

    //#region useEffect
    useEffect(() => {
        if (mount.current) return;
        console.log(`${imgURL} is loaded`);

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
        const radarButton = radarButtonRef.current;
        const totalImagesElement = document.getElementById('total-images');
        const popup = document.getElementById('popup');
        let isMovingButtonClicked = false;
        let isCroppingButtonClicked = false;
        let isRadarButtonClicked = false;
        let seletedCroppedImage: Array<HTMLCanvasElement>;
        let scale = 1;
        let imageX = 0;
        let imageY = 0;
        let totalImages = 0;
        let isMoving = false;
        let lastMovingX = 0;
        let lastMovingY = 0;

        // Initialize values 
        totalImagesElement?.parentElement?.classList.add('hidden');

        // Create a new image object
        const img = new Image();
        const fixedSizeImage = new Image();
        //#region declare fixed size image
        // Cài đặt hình ảnh cố định để cắt ảnh
        // const imgURL = localStorage.getItem('imageURL')?.toString();

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

        // Array to store rectangles
        const rectangles: Array<any> = [];

        // Variables to track rectangle drawing
        let startX: number, startY: number;
        let isDrawing = false;

        // Draw the image on the canvas once it's loaded
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            if (img.height !== 600) {
                scale = 600 / img.height;
            }
            drawImageAndRectangles(ctx, canvas, img, rectangles);
        };

        radarButton?.addEventListener('click', (e) => {
            isRadarButtonClicked = true;
            isCroppingButtonClicked = false;
            isMovingButtonClicked = false;
        })

        croppingButton?.addEventListener('click', e => {
            isCroppingButtonClicked = true;
            isMovingButtonClicked = false;
            isRadarButtonClicked = false;
        })

        movingButton?.addEventListener('click', (e) => {
            console.log("IsMovingButtonClicked is listened");
            isMovingButtonClicked = true;
            isCroppingButtonClicked = false;
            isRadarButtonClicked = false;

        })


        // Function to start drawing
        canvas?.addEventListener('mousedown', (e) => {
            console.log('mousedown');

            if (isCroppingButtonClicked) {
                console.log("isCroppingButtonClicked")
                rectangles.length = 0;
                startX = e.offsetX;
                startY = e.offsetY;
                isDrawing = true;
                popup?.classList.add('hidden');
            }
            if (isMovingButtonClicked) {
                console.log("isMovingButtonClicked")
                isMoving = true;
                lastMovingX = e.offsetX;
                lastMovingY = e.offsetY;
                popup?.classList.add('hidden');
            }
            if (isRadarButtonClicked) {
                let startX = e.offsetX;
                let startY = e.offsetY;
                const realStartX = (startX - scale * imageX) / scale;
                const realStartY = (startY - scale * imageY) / scale;
                console.log(`X: ${Math.ceil(realStartX)}, Y: ${Math.ceil(realStartY)}`);


            }
        });

        // Function to draw the rectangle while mouse is moving
        canvas?.addEventListener('mousemove', (e) => {
            if (isCroppingButtonClicked && isDrawing) {
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
            else if (isMovingButtonClicked && isMoving) {
                let currentX = e.offsetX;
                let currentY = e.offsetY;
                imageX += (currentX - lastMovingX) * 1.1 / scale;
                imageY += (currentY - lastMovingY) * 1.1 / scale;
                lastMovingX = currentX;
                lastMovingY = currentY;


                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                if (ctx) {
                    drawImage(ctx, canvas, img);
                }
                rectangles.length = 0;
            }
            else if (isRadarButtonClicked) {
                let currentX = e.offsetX;
                let currentY = e.offsetY;
                
                const realStartX = (currentX - scale * imageX) / scale;
                const realStartY = (currentY - scale * imageY) / scale;
                // Set the position of the popup above the mouse
                if (popup && realStartX >= 0 && realStartY >= 0) {
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;
                    console.log(`Current X: ${mouseX}, Current Y: ${mouseY}`);
                    popup.style.left = `${mouseX}px`;
                    popup.style.top = `${mouseY - popup.offsetHeight - 10}px`;
                    console.warn(`left ${popup.style.left}, top ${popup.style.top}`);
                    popup.textContent = `X: ${Math.ceil(realStartX)}, Y: ${Math.ceil(realStartY)}`;
                    popup.classList.remove('hidden');
                }
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
                const realStartX = startX - scale * imageX;
                const realStartY = startY - scale * imageY;
                rectangles.push({ startX, startY, realStartX, realStartY, width, height });
                isDrawing = false;
                // Redraw everything
                drawImageAndRectangles(ctx, canvas, img, rectangles);
            } else if (isMovingButtonClicked && isMoving) {
                isMoving = false;
                lastMovingX = e.offsetX;
                lastMovingY = e.offsetY;
            }
        });

        // Add an event listener to crop the most recent rectangle
        document.addEventListener('keydown', (e) => {
            try {
                if (isCroppingButtonClicked && e.key === 'Enter') {
                    cropImage();
                }
            } catch (error) {
                console.error(error);

            }
        });

        saveButtonRef?.current?.addEventListener('click', (e) => {
            try {
                if (isCroppingButtonClicked) {
                    cropImage();
                }
            } catch (error) {
                console.error(error);

            }
        });


        const cropImage = () => {
            let length = rectangles.length
            const rect = rectangles[length - 1]
            let canvas = document.createElement("canvas");
            let canvasContext = canvas.getContext('2d');
            let imageData2 = fixedSizeCtx?.getImageData(rect.realStartX / scale, rect.realStartY / scale, rect.width / scale, rect.height / scale);
            let imageData = ctx?.getImageData(rect.startX, rect.startY, rect.width, rect.height);
            canvas.width = rect.width / scale;
            canvas.height = rect.height / scale;
            canvas.classList.add('shadow-gray-300', 'shadow-xl', 'cropped-canvas', );
            canvas.style.width = '120px';
            canvas.style.height = '100px';
            canvas.style.objectFit = 'contain';
            // add event listener to choose cropped image
            canvas.addEventListener('click', () => {
                canvas.classList.toggle('border-2');
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

                rectangles.forEach((rect, index) => {
                    if (mouseX >= rect.startX && mouseX < rect.startX + rect.width &&
                        mouseY >= rect.startY && mouseY < rect.startY + rect.height) {
                    }
                });
            }

        });

        const drawImage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.scale(scale, scale);
                // ctx.drawImage(img, centerMoveX, centerMoveY);
                ctx.drawImage(img, imageX, imageY, img.width, img.height);
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
                try {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawImage(ctx, canvas, img);
                    // Draw all rectangles
                    const rectanglesLength = rectangles.length;
                    if (rectanglesLength > 0) {
                        ctx.beginPath();
                        ctx.rect(rectangles[rectanglesLength - 1].startX, rectangles[rectanglesLength - 1].startY, rectangles[rectanglesLength - 1].width, rectangles[rectanglesLength - 1].height);
                        ctx.strokeStyle = 'white';
                        ctx.stroke();
                    }
                } catch (error) {
                    console.error(error);

                }

            }
        }


        // Cleanup function
        return () => { mount.current = true; };
    }, [imgURL]);

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
        <div id={id} className={className}>
            <div id="popup" className="hidden z-50 absolute bg-white text-sm text-gray-800 p-2 rounded-md shadow-lg border border-gray-200">
            </div>
            <div className="flex justify-center">
                <div className=" border-[1px] 
                        border-[#e6e6e8] 
                            rounded-md">
                    <div className="flex justify-between border-b-[1px] text-xl border-[#e6e6e8] p-[10px] ">
                        <span className="font-semibold">Assets Modifier</span>
                        <div className="flex gap-5">
                            <Hint label="Cropped Images">
                                <Button
                                    variant={"ghost"}
                                    className="px-2 rounded-sm relative"
                                >
                                    <ImagesIcon
                                        onClick={() => setOpenPopup(!openPopup)}
                                        className="relative"
                                        size={20} />
                                    <span className="absolute flex items-center justify-center top-[-5px] left-[-5px] w-[20px] h-[20px] p-[1px] text-[14px] text-white text-center rounded-xl bg-red-700">
                                        <span id="total-images">0</span>
                                    </span>
                                </Button>
                            </Hint>
                            <Hint label="Save">
                                <Button
                                    variant={"ghost"}
                                    className=" px-2 rounded-sm"
                                    ref={saveButtonRef}
                                >
                                    <SaveIcon
                                        className="relative"
                                        size={20} />
                                </Button>
                            </Hint>
                            <Hint label="Find X Y">
                                <Button
                                    variant={"ghost"}
                                    ref={radarButtonRef}
                                    onClick={() => { setIsRadar(!isRadar); setIsCropping(false); setIsMoving(false) }}
                                    className={`${isRadar ? "bg-gray-400" : ""} rounded-sm px-2`}
                                >
                                    <RadarIcon size={20} />
                                </Button>
                            </Hint>
                            <Hint label="Crop Image">
                                <Button
                                    variant={"ghost"}
                                    ref={croppingButtonRef}
                                    onClick={() => { setIsCropping(!isCropping); setIsMoving(false); setIsRadar(false) }}
                                    className={`${isCropping ? "bg-gray-400" : ""} rounded-sm px-2`}
                                >
                                    <CropIcon size={20} />
                                </Button>
                            </Hint>
                            <Hint label="Move Image">
                                <Button
                                    variant={"ghost"}
                                    ref={movingButtonRef}
                                    onClick={() => { setIsMoving(!isMoving); setIsCropping(false); setIsRadar(false) }}
                                    className={`${isMoving ? "bg-gray-400" : ""} px-2 rounded-sm`}>
                                    <MoveIcon size={20} />
                                </Button>
                            </Hint>
                            <Hint label="Zoom In">
                                <Button
                                    variant={"ghost"}
                                    ref={zoomInRef}
                                    className="px-2 rounded-sm">
                                    <ZoomIn size={20} />
                                </Button>
                            </Hint>
                            <Hint label="Zoom Out">
                                <Button
                                    variant={"ghost"}
                                    ref={zoomOutRef} className="px-2 rounded-sm">
                                    <ZoomOut size={20} />
                                </Button>
                            </Hint>
                        </div>
                    </div>
                    <div className="relative flex w-auto h-auto p-[30px]">
                        <canvas
                            ref={canvasRef}
                            width={window.innerWidth > 2000 ? 1800 : window.innerWidth > 1000 ? 900 : window.innerWidth * 0.8}
                            height={window.innerWidth > 2000 ? 1200 : window.innerWidth > 1000 ? 600 : window.innerWidth * 0.533}
                            className="shadow-gray-100
                                       shadow-sm border-[1px] 
                                       border-[#e6e6e8] 
                                       rounded-md 
                                       relative 
                                       bg-gray-100
                                       w-full
                                       h-auto
                                    "
                        >
                        </canvas>
                        <div ref={pulseAreaRef} className={`${screen.width > 2000 ? 'w-[1800px] h-[1200px]' : 'w-[900px] h-[600px]'} bg-white bg-opacity-45 absolute text-4xl flex items-center justify-center animate-pulse `}><span>Click to crop</span></div>
                    </div>


                </div>

            </div>
            <div
                className={`popup flex items-center fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 ${openPopup ? 'block' : 'hidden'}`}
            >
                <div className="popup-content bg-white w-[700px] h-[500px] max-h-[600px] m-auto p-5 rounded-md">
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
