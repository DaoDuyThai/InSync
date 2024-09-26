'use client'
import { useEffect, useRef } from "react";
import Toolkit from "./_components/toolkit";
export default function ImagePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const croppedRef = useRef<HTMLCanvasElement>(null);
    const mount = useRef(false);
    const canvasAreaRef = useRef<HTMLDivElement>(null);
    const pulseAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (mount.current === false) {
            // Get the canvas and its contextF
            document.title = "InSync  - Asset Modification"
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            const croppedCanvas = croppedRef.current;
            const croppedCtx = croppedCanvas?.getContext('2d');
            const canvasArea = canvasAreaRef.current;
            const pulseArea = pulseAreaRef.current;
            let selectedRectIndex;
            // Create a new image object
            const img = new Image();
            img.src = 'https://static.chotot.com/storage/chotot-kinhnghiem/c2c/2019/10/nuoi-meo-can-gi-0-1024x713.jpg'; // Update with the path to your image

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


            // Function to start drawing
            canvas?.addEventListener('mousedown', (e) => {
                const rect = canvas.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
                isDrawing = true;
            });

            // Function to draw the rectangle while mouse is moving
            canvas?.addEventListener('mousemove', (e) => {
                if (!isDrawing) return;

                // Calculate the current mouse position
                const rect = canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;

                // Calculate width and height of the rectangle
                const width = currentX - startX;
                const height = currentY - startY;

                // Clear the canvas and redraw the image and existing rectangles
                drawImageAndRectangles(ctx, canvas, img, rectangles);

                // Draw the new rectangle being created
                if (ctx) {
                    ctx.beginPath();
                    ctx.rect(startX, startY, width, height);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'white';
                    ctx.stroke();
                }
            });

            // Function to finish drawing the rectangle
            canvas?.addEventListener('mouseup', (e) => {

                if (isDrawing) {
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
                if (e.key === 'Enter') {
                    let length = rectangles.length
                    const rect = rectangles[length - 1]
                    let canvas = document.createElement("canvas");
                    let canvasContext = canvas.getContext('2d');
                    let imageData = ctx?.getImageData(rect.startX, rect.startY, rect.width, rect.height);
                    canvas.width = rect.width;
                    canvas.height = rect.height;
                    canvas.classList.add('shadow-gray-300', 'shadow-xl', 'border-2', 'border-black', 'rounded-md', 'm-2', 'cropped-canvas');
                    canvas.addEventListener('click', (e) => {
                        canvas.classList.toggle('border-4');
                        canvas.classList.toggle('border-green-500');
                    });
                    if (imageData) {
                        canvasContext?.putImageData(imageData, 0, 0);
                    }
                    canvasArea?.appendChild(canvas);


                }
            });

            pulseArea?.addEventListener('click', (e) => {
                if (pulseArea) {
                    pulseArea.style.display = 'none';
                }
            });


            canvas?.addEventListener('click', (e) => {
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
            });

        }

        // Function to draw image and rectangles
        function drawImageAndRectangles(ctx: any, canvas: any, img: any, rectangles: Array<any>) {
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Draw all rectangles
                rectangles.forEach(rect => {
                    ctx.beginPath();
                    ctx.rect(rect.startX, rect.startY, rect.width, rect.height);
                    ctx.strokeStyle = 'white';
                    ctx.stroke();
                });
            }
        }
        return () => {
            mount.current = true;
        }
    }, [])

    return (
        <div className="p-5">
            <div className="flex justify-center">
                <canvas ref={canvasRef} width="900" height="600" className="shadow-gray-300 shadow-sm border-2 border-black rounded-md relative"></canvas>
                <div ref={pulseAreaRef} className="w-[900px] h-[600px] bg-white bg-opacity-45 absolute text-4xl flex items-center justify-center animate-pulse "><span>Click to crop</span></div>
            </div>
            <div ref={canvasAreaRef} className="overflow-x-auto mx-auto max-w-[900px] flex"></div>
        </div>

    )
}
