"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as React from "react";

interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
    deleteScenario: () => void;
    renameScenario: (id: string, newTitle: string) => Promise<void>;
}

export const Actions = ({
    children,
    side,
    sideOffset,
    id,
    title,
    deleteScenario,
    renameScenario
}: ActionsProps) => {
    const [newTitle, setNewTitle] = React.useState<string>(title);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    const onCopyLink = () => {
        navigator.clipboard
            .writeText(`${window.location.origin}/scenario/${id}`)
            .then(() => {
                toast.success("Link copied");
            })
            .catch(() => {
                toast.error("Failed to copy link");
            });
    };

    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await renameScenario(id, newTitle);
        } catch (error) {
            console.error("Failed to rename scenario.");
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent
                onClick={(e) => {
                    e.stopPropagation();
                }}
                side={side}
                sideOffset={sideOffset}
            >
                <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy scenario link
                </DropdownMenuItem>

                {/* Rename Dialog */}

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="cursor-pointer text-sm w-full justify-start font-normal">
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" >
                        <DialogHeader>
                            <DialogTitle>Edit scenario title</DialogTitle>
                            <DialogDescription>
                                Enter a new title for this scenario.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRename} className="space-y-4">
                            <Input
                                required
                                maxLength={60}
                                minLength={5}
                                placeholder="Enter new title"
                                // value={title} // Pre-filled with the current title
                                onChange={(e) => {
                                    setNewTitle(e.target.value)
                                }}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Renaming..." : "Submit"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>


                {/* Delete Scenario */}
                <ConfirmModal
                    header="Delete Scenario?"
                    description="This will delete the scenario and all of its contents."
                    onConfirm={deleteScenario}
                >
                    <Button variant="ghost" className="p-3 cursor-pointer text-sm w-full justify-start font-normal">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </ConfirmModal>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
