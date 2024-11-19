"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { ConfirmModal } from "@/components/confirm-modal";
import { Trash2 } from "lucide-react";
import '@/components/rich-text.css';

type Doc = {
    id: string;
    slug: string;
    title: string;
    content: string;
    note: string | null;
    order: number
    categoryId: string
    categoryName: string | null
    dateCreated: string | null;
    dateUpdated: string | null;
};

const AdminDocSlug = () => {
    const { slug } = useParams<{ slug: string }>() ?? {};
    const [documentData, setDocumentData] = React.useState<Doc | null>(null);
    const [value, setValue] = React.useState<any>("");
    const [loading, setLoading] = React.useState<boolean>(true);
    const [pending, setPending] = React.useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState<boolean>(false);
    const [editedTitle, setEditedTitle] = React.useState<string>("");
    const [editedSlug, setEditedSlug] = React.useState<string>("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/slug/${slug}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setDocumentData(data);
                setValue(data.content);
                setEditedTitle(data.title);
                setEditedSlug(data.slug);
            } else if (response.status === 404) {
                toast.error("Document not found");
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
        if (!documentData) {
            toast.error("No document data available");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/slug/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY!}`,
                },
                body: JSON.stringify({
                    id: documentData.id,
                    slug: documentData.slug,
                    title: documentData.title,
                    content: value,
                    note: documentData.note,
                    categoryId: documentData.categoryId
                }),
            });
            if (!response.ok) throw new Error("Failed to save Document.");
            toast.success("Document saved successfully");
        } catch (error) {
            console.error("Error saving Document:", error);
            toast.error("Failed to save Document");
        } finally {
            setPending(false);
        }
    };

    const handleDeleteDocument = async () => {
        if (!documentData) {
            toast.error("No Document data available");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${documentData.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY!}`,
                }
            });
            if (!response.ok) throw new Error("Failed to delete Document.");
            toast.success("Document deleted successfully");
        } catch (error) {
            console.error("Error deleting Document:", error);
            toast.error("Failed to delete Document");
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
        if (!documentData) {
            toast.error("No Document data available");
            return;
        }
        setPending(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/slug/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY!}`,
                },
                body: JSON.stringify({
                    id: documentData.id,
                    slug: editedSlug,
                    title: editedTitle,
                    content: documentData.content,
                    note: documentData.note,
                    categoryId: documentData.categoryId
                }),
            });

            toast.success("Document settings updated");
            setIsEditDialogOpen(false); // Close dialog only after update completes
        } catch (error) {
            console.error("Error updating Document settings:", error);
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
    if (!documentData) return <div className="text-center mt-4">Document not found</div>;

    return (
        <div className="w-full h-[calc(100vh-100px)] overflow-hidden flex flex-col">
            <MinimalTiptapEditor
                value={value}
                onChange={setValue}
                className="w-full flex-1 overflow-y-auto my-4 rich-text "
                editorContentClassName="p-5"
                output="html"
                placeholder="Type your description here..."
                autofocus={true}
                editable={true}
                editorClassName="focus:outline-none"
            />
            <div className="flex justify-center my-2 gap-4">
                <Button variant="ghost" onClick={() => setIsEditDialogOpen(true)}>
                    Document Settings
                </Button>
                <Button disabled={pending} onClick={handleSaveContent}>
                    Save
                </Button>
            </div>
            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Document Settings</DialogTitle>
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
                                header="Delete Document?"
                                description="This will delete the Document and all of its contents."
                                onConfirm={handleDeleteDocument}
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

export default AdminDocSlug;
