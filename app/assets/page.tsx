'use client'

import { log } from "console";
import { CalendarFoldIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ImagePage() {
    const mount = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (mount.current === false) {
            // Set page title
            document.title = "InSync - Assets Management";
        }

        return () => {
            mount.current = true;
        }
    });

    const handleClick = (id: string) => {
        console.log("clicked");
        router?.push(`/assets/${id}`);
    }

    return (
        <div>
            <div className="text-lg bg-[#f2f6fa] py-2 px-4">
                <CalendarFoldIcon size="24" className="inline-block" />
                <span className="mx-2">20/09/2023</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {[...Array(10)].map((_, i) => (
                    // <div key={i} className="border-2 border-white">
                    //     <img onClick={() => handleClick(i.toString())} className="w-[100px] hover:animate-pulse" src="https://st.quantrimang.com/photos/image/2018/02/26/bat-thong-bao-khi-chia-se-hinh-anh-1.jpg" alt="anh-nen-dien-thoai" />
                    
                    // </div>
                    <div 
                        key={i}
                        className="overflow-hidden rounded-md">
                            <img 
                                key={i}
                                onClick={() => handleClick(i.toString())}
                                alt="Collection of captured images" 
                                loading="lazy" 
                                decoding="async" 
                                data-nimg="1" 
                                className="h-[200px] w-auto object-cover transition-all hover:scale-105 aspect-[3/4]" 
                                src="https://st.quantrimang.com/photos/image/2018/02/26/bat-thong-bao-khi-chia-se-hinh-anh-1.jpg"
                                style={{"color": "transparent"}}
                            />
                    </div>
                    
                ))}
            </div>
        </div>
    )
}
