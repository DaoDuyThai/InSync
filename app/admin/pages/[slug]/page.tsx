"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Loading } from "@/components/loading";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { ConfirmModal } from "@/components/confirm-modal";
import '@/components/rich-text.css';
import { useAuth } from "@clerk/nextjs";

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
    const { slug } = useParams<{ slug: string }>() ?? {};
    const [pageData, setPageData] = React.useState<Page | null>(null);
    const [value, setValue] = React.useState<any>("");
    const [loading, setLoading] = React.useState<boolean>(true);
    const [pending, setPending] = React.useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState<boolean>(false);
    const [editedTitle, setEditedTitle] = React.useState<string>("");
    const [editedSlug, setEditedSlug] = React.useState<string>("");
    const { getToken } = useAuth();

    const fetchData = async () => {
        setLoading(true);
        try {
            const jwt = await getToken({ template: "InSyncRoleToken" });
            if (!jwt) {
                throw new Error("Failed to retrieve JWT token.");
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/slug/${slug}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                        Authorization: `Bearer ${jwt}`,
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setPageData(data);
                setValue(data.content);
                setEditedTitle(data.title);
                setEditedSlug(data.slug);
            } else if (response.status === 404) {
                toast.error("Page not found");
                window.location.href = "/admin";
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

    const handleSaveContent = async () => {
        if (!pageData) {
            toast.error("No page data available");
            return;
        }
        setPending(true);
        try {
            const jwt = await getToken({ template: "InSyncRoleToken" });
            if (!jwt) {
                throw new Error("Failed to retrieve JWT token.");
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/slug/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    Authorization: `Bearer ${jwt}`,
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

    const handleDeletePage = async () => {
        if (!pageData) {
            toast.error("No page data available");
            return;
        }
        setPending(true);
        try {
            const jwt = await getToken({ template: "InSyncRoleToken" });
            if (!jwt) {
                throw new Error("Failed to retrieve JWT token.");
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/${pageData.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    Authorization: `Bearer ${jwt}`,
                }
            });
            if (!response.ok) throw new Error("Failed to delete page.");
            toast.success("Page deleted successfully");
        } catch (error) {
            console.error("Error deleting page:", error);
            toast.error("Failed to delete page");
        } finally {
            setPending(false);
            setIsEditDialogOpen(false); // Close dialog only after update completes
            setTimeout(() => {
                window.location.href = "/admin";
            }, 2000);
        }
    }

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pageData) {
            toast.error("No page data available");
            return;
        }
        setPending(true);
        try {
            const jwt = await getToken({ template: "InSyncRoleToken" });
            if (!jwt) {
                throw new Error("Failed to retrieve JWT token.");
            }
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/slug/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    id: pageData.id,
                    slug: editedSlug,
                    title: editedTitle,
                    content: pageData.content,
                    note: pageData.note,
                }),
            });

            toast.success("Page settings updated");
            setIsEditDialogOpen(false); // Close dialog only after update completes
        } catch (error) {
            console.error("Error updating page settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setPending(false);
            setIsEditDialogOpen(false); // Close dialog only after update completes
            setTimeout(() => {
                window.location.href = "/admin";
            }, 2000);
        }

    };

    if (loading) return <Loading />;
    if (!pageData) return <div className="text-center mt-4">Page not found</div>;

    return (
        <div className="w-full h-[calc(100vh-100px)] overflow-hidden flex flex-col">
            <MinimalTiptapEditor
                value={value}
                onChange={setValue}
                className="w-full flex-1 overflow-y-auto my-4 "
                editorContentClassName="h-full p-5 border-none rich-text"
                output="html"
                placeholder="Type your description here..."
                autofocus={true}
                editable={true}
                editorClassName="focus:outline-none "
            />
            <div className="flex justify-center my-2 gap-4">
                <Button variant="ghost" onClick={() => setIsEditDialogOpen(true)}>
                    Page Settings
                </Button>
                <Button disabled={pending} onClick={handleSaveContent}>
                    Save
                </Button>
            </div>
            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Page Settings</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSave} className="grid py-4 gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input
                                id="title"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="col-span-3"
                                required
                                minLength={2}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="slug" className="text-right">Slug</Label>
                            <Input
                                id="slug"
                                value={editedSlug}
                                onChange={(e) => setEditedSlug(e.target.value)}
                                className="col-span-3"
                                required
                                minLength={2}
                            />
                        </div>
                        <DialogFooter className="flex justify-center py-2">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                            <ConfirmModal
                                header="Delete page?"
                                description="This will delete the page and all of its contents."
                                onConfirm={handleDeletePage}
                            >
                                <Button
                                    variant="redBg"
                                    className="flex cursor-pointer text-sm justify-center font-normal"
                                    disabled={pending}
                                >

                                    Delete
                                </Button>
                            </ConfirmModal>
                            <Button type="submit" disabled={pending}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPageSlug;
