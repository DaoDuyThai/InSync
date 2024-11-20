"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Loading } from "@/components/loading";
import { toast } from "sonner";

import '@/components/rich-text.css';

type Page = {
    id: string;
    slug: string;
    title: string;
    content: string;
    note: string | null;
    dateCreated: string | null;
    dateUpdated: string | null;
};

const PageSlug = () => {
    const { slug } = useParams<{ slug: string }>() ?? {};
    const [pageData, setPageData] = React.useState<Page | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
   
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/slug/${slug}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setPageData(data);
            } else if (response.status === 404) {
                toast.error("Page not found");
                setTimeout(() => {
                    window.location.href = "/";
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
        <div className="container rich-text">
            <h1 className=" text-center uppercase ">{pageData?.title}</h1>
            <div
                dangerouslySetInnerHTML={{ __html: pageData?.content || '' }}
            />
        </div>
    );
};

export default PageSlug;
