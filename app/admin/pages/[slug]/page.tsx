"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Page = {
    id: string;
    slug: string;
    title: string;
    content: string;
    note: string | null;
    dateCreated: string | null;
    dateUpdated: string | null;
};

const AdminPageSlug = () => {
    const { slug } = useParams();
    const router = useRouter();
    const [pageData, setPageData] = React.useState<Page | null>(null);
    const [value, setValue] = React.useState<any>("");
    const [loading, setLoading] = React.useState<boolean>(true);
    const [pending, setPending] = React.useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/slug/${slug}`);
            if (response.ok) {
                const data = await response.json();
                setPageData(data);
                setValue(data.content);
            } else if (response.status === 404) {
                toast.error("Page not found");
                router.push("/admin"); // Navigate back to pages list
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

    const handleSave = async () => {
        if (!pageData) {
            toast.error("No page data available");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/slug/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: pageData.id,
                    slug: pageData.slug,
                    title: pageData.title,
                    content: value,
                    note: pageData.note,
                }),
            });
            if (!response.ok) throw new Error("Failed to save page.");
            toast.success("Page saved successfully");
        } catch (error) {
            console.error("Error saving page:", error);
            toast.error("Failed to save page");
        } finally {
            setPending(false);
        }
    };

    if (loading) return <Loading />;
    if (!pageData) return <div className="text-center mt-4">Page not found</div>;

    return (
        <div className="w-full h-[calc(100vh-100px)] overflow-hidden flex flex-col">
            <MinimalTiptapEditor
                value={value}
                onChange={setValue}
                className="w-full flex-1 overflow-y-auto my-4"
                editorContentClassName="p-5 h-full"
                output="html"
                placeholder="Type your description here..."
                autofocus={true}
                editable={true}
                editorClassName="focus:outline-none"
            />
            <div className="flex justify-center my-2 gap-4">
                <Button disabled={pending} onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default AdminPageSlug;
