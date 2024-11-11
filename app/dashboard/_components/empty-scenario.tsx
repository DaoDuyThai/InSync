"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ProjectSettings } from "./project-settings"
import React from "react"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { Pencil } from "lucide-react"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface EmptyScenarioProps {
    createScenario: (title: string) => Promise<void>
}

export const EmptyScenario = ({
    createScenario
}: EmptyScenarioProps) => {
    const [title, setTitle] = React.useState<string>("Untitled");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    // Create a new scenario
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createScenario(title);
        } catch (error) {
            console.error("Failed to rename scenario.");
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };

    return (
        <div className="w-full h-full md-overflow-y-auto">
            <div className='flex justify-end align-middle'>
                <ProjectSettings />
            </div>
            <div className="h-full flex flex-col items-center justify-center">
                <Image src="/empty-scenario.svg" height={110} width={100} alt="Empty" />
                <h2 className="text-2xl font-semibold mt-6">
                    Create your first scenario
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                    Start by creating a scenario for your project
                </p>
                <div className="mt-6">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size={"lg"} className="cursor-pointer text-sm w-full justify-start font-normal">
                                <Pencil className="h-4 w-4 mr-2" />
                                Create Scenario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md" >
                            <DialogHeader>
                                <DialogTitle>Create Scenario</DialogTitle>
                                <DialogDescription>
                                    Enter title for this scenario.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <Input
                                    required
                                    maxLength={18}
                                    minLength={5}
                                    placeholder="Enter scenario title"
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                    }}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Creating..." : "Submit"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}