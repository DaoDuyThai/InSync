import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/confirm-modal';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { selectProject } from "@/store/projectSlice";
import { toast } from "sonner";

type Project = {
    id: string;
    projectName: string;
    description: string | null;
    userId: string;
    displayName: string | null;
    dateCreated: string | null;
    dateUpdated: string | null;
    isPublish: boolean | null;
}

export const ProjectSettings = () => {
    const [project, setProject] = React.useState<Project | null>(null);
    const [newTitle, setNewTitle] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState(false);

    const selectedProjectId = useSelector((state: RootState) => state.project.selectedProject);
    const dispatch = useDispatch<AppDispatch>();

    // Fetch selected project details
    const fetchCurrentProject = async () => {
        if (!selectedProjectId) {
            toast.error("No project selected");
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${selectedProjectId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            const data = await response.json();
            setProject(data);
            // Set the input field to the current project name
            setNewTitle(data.projectName || "");
        } catch (error) {
            console.error("Error fetching project:", error);
        }
    };

    // Load selected project from localStorage when component mounts
    React.useEffect(() => {
        const storedProjectId = localStorage.getItem("selectedProjectId");
        if (storedProjectId) {
            dispatch(selectProject(storedProjectId));
        }
    }, [dispatch]);


    // Handle renaming the project
    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !selectedProjectId) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${selectedProjectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                },
                body: JSON.stringify({
                    projectName: newTitle,
                    id: selectedProjectId,
                    description: project?.description,
                    isPublish: project?.isPublish,
                }),
            });
            if (response.ok) {
                toast.success("Project renamed successfully!");
                setProject((prevProject) => prevProject ? { ...prevProject, projectName: newTitle } : null);
            } else {
                toast.error("Failed to rename project.");
            }
        } catch (error) {
            console.error("Error renaming project:", error);
            toast.error("Failed to rename project.");
        } finally {
            fetchCurrentProject();
            setIsLoading(false);
            setOpen(false);
        }
    };

    // Handle deleting the project
    const handleDelete = async () => {
        if (!selectedProjectId) return;
        setIsLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${selectedProjectId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                },
            });
            toast.success("Project deleted successfully!");
            // Clear the project from local state and Redux
            setProject(null);
            // Remove the selectedProjectId from localStorage
            localStorage.removeItem("selectedProjectId");
            // Optionally, dispatch an action to clear the selected project in Redux
            dispatch(selectProject(''));
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Failed to delete project.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Settings size={24} className='inline-block' />
            </DropdownMenuTrigger>
            <DropdownMenuContent side={"left"}>
                <DropdownMenuLabel className="p-3"><span className='text-lg'>Project Settings</span></DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Rename Project */}
                <DropdownMenuLabel>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={fetchCurrentProject} variant="ghost" size={'sm'} className="flex cursor-pointer text-sm w-full justify-center font-normal">
                                <Pencil className="h-4 w-4 mr-2" />
                                Rename
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit project title</DialogTitle>
                                <DialogDescription>
                                    Enter a new title for this project
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleRename} className="space-y-4">
                                <Input
                                    required
                                    maxLength={18}
                                    minLength={5}
                                    placeholder="Enter new title"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)} />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Renaming...' : 'Submit'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuLabel>
                {/* Delete Project */}
                <DropdownMenuLabel>
                    <ConfirmModal
                        header="Delete project?"
                        description="This will delete the project and all of its contents."
                        onConfirm={handleDelete}
                        disabled={isLoading}>
                        <Button onClick={fetchCurrentProject} variant="redBg" size={'sm'} className="flex cursor-pointer text-sm w-full justify-center font-normal">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </ConfirmModal>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
