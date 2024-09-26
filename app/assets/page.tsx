'use client'

import { useEffect, useRef } from "react";

export default function ImagePage() {
    const mount = useRef(false);

    useEffect(() => {
        if(mount.current === false) {
            // Set page title
            document.title = "InSync - Assets Management";
            

        }

        return () => {
            mount.current = true;
        }
    });

    return (
       <div className="p-10">Image Page</div>
    )
}
