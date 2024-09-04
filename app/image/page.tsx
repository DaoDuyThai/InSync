'use client'
import { useEffect, useRef } from "react";

export default function ImagePage() {
     // Create a ref for the canvas element
     const canvasRef = useRef<HTMLCanvasElement | null>(null);

     useEffect(() => {
         // Get the canvas element and its 2D context
         const canvas = canvasRef.current;
         if (canvas) {
             const ctx = canvas.getContext('2d');
             if (ctx) {
                 // Set the rectangle properties
                 const x = 50; // X coordinate of the top-left corner
                 const y = 50; // Y coordinate of the top-left corner
                 const width = 50; // Width of the rectangle
                 const height = 50; // Height of the rectangle
 
                 // Set the fill color
                 ctx.fillStyle = 'blue'; // Color for the rectangle
 
                 // Draw the rectangle
                 ctx.fillRect(x, y, width, height);
             }
         }
     }, []); // Empty dependency array ensures this runs once after the initial render
 
     return (
         <div>
             <canvas
                 ref={canvasRef}
                 width={500}
                 height={500}
                 style={{ border: '1px solid black' }}
             />
         </div>
     );
}