"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Loading } from "@/components/loading";
import { toast } from "sonner";

import '@/components/rich-text.css';

type Doc = {
    id: string
    slug: string
    title: string
    content: string
    note: string
    dateCreated: string | null
    dateUpdated: string | null
    categoryId: string | null
    order: number
    categoryName: string | null
}

const DocSlug = () => {
    const { slug } = useParams() as { slug: string };
    const [documentData, setDocumentData] = React.useState<Doc | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/slug/${slug}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setDocumentData(data);

            } else if (response.status === 404) {
                toast.error("Document not found");
                setTimeout(() => {
                    window.location.href = "/docs";
                }, 2000);
            } else {
                console.error("Error fetching data");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (slug) fetchData();
    }, [slug]);

    if (loading) return (
        <div className="w-full min-h-[calc(100vh-480px)] flex items-center">
            <Loading />
        </div>
    )

    return (
        <div className="py-4 rich-text">
            <h1 className=" text-center uppercase">{documentData?.title}</h1>
            <div
                dangerouslySetInnerHTML={{ __html: documentData?.content || '' }}
            />
        </div>
    );
};

export default DocSlug;
