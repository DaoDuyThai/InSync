"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { Pencil, Plus } from "lucide-react"
// import { api } from "@/convex/_generated/api"
// import { useApiMutation } from "@/hooks/use-api-mutation"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
// import { useProModal } from "@/store/use-pro-modal"

interface NewScenarioButtonProps {
    createScenario: (title: string) => Promise<void>
}

export const NewScenarioButton = ({
    createScenario
}: NewScenarioButtonProps) => {
    // TODO: Pro Mode
    // const { onOpen } = useProModal();
    // TODO: Create board
    // const { mutate, pending } = useApiMutation(api.board.create);

    const [title, setTitle] = React.useState<string>("Untitled");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

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
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" >
                    <DialogHeader>
                        <DialogTitle>Edit scenario title</DialogTitle>
                        <DialogDescription>
                            Enter a new title for this scenario.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <Input
                            required
                            maxLength={60}
                            minLength={5}
                            placeholder="Enter scenario title"
                            // value={title} // Pre-filled with the current title
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
                                {isLoading ? "Renaming..." : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <button
                onClick={createScenario}
                className={cn(
                    "col-span-1 aspect-[100/127] bg-gray-500 rounded-lg hover:bg-gray-700 flex flex-col items-center justify-center py-6"
                    , (false) && "opacity-75 hover:bg-blue-600 cursor-not-allowed")}
            >
                <div />
                <Plus className="h-12 w-12 text-white stroke-1" />
                <p className="text-sm text-white font-light">
                    New Scenario
                </p>
            </button>
        </div>

    )
}
