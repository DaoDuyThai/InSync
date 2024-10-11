"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { Plus } from "lucide-react"
// import { api } from "@/convex/_generated/api"
// import { useApiMutation } from "@/hooks/use-api-mutation"
import { toast } from "sonner"
// import { useProModal } from "@/store/use-pro-modal"

interface NewScenarioButtonProps {
    projectId: string,
    disabled?: boolean
}

export const NewScenarioButton = ({
    projectId,
    disabled
}: NewScenarioButtonProps) => {
    // TODO: Pro Mode
    // const { onOpen } = useProModal();
    // TODO: Create board
    // const { mutate, pending } = useApiMutation(api.board.create);

    const [pending, setPending] = React.useState(true);

    const { user, isLoaded } = useUser();

    const images = [
        "/placeholders/1.svg",
        "/placeholders/2.svg",
        "/placeholders/3.svg",
        "/placeholders/4.svg",
        "/placeholders/5.svg",
        "/placeholders/6.svg",
        "/placeholders/7.svg",
        "/placeholders/8.svg",
        "/placeholders/9.svg",
        "/placeholders/10.svg",
    ]

    const onClick = async () => {
        if (!user || !isLoaded) return;
        try {
            const randomImage = images[Math.floor(Math.random() * images.length)]
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/byuserclerk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        projectId: projectId,
                        scenarioName: "Untitled",
                        userIdClerk: user.id,
                        description: "Description",
                        stepsWeb: "Steps Web",
                        stepsAndroid: "Steps Android",
                        isFavorites: false,
                        imageUrl: "",
                    }
                ),
            });
            const data = await response.json();
            // console.log(data);
            // console.log(response)
            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.title);
            }


        } catch (error) {
            console.error("Error creating project:", error);
        }

        // mutate({
        //     orgId,
        //     title: "Untitled"
        // })
        //     .then((id) => {
        //         toast.success("Board created")
        //         //TODO: Redirect to /board/{id}
        //     })
        //     .catch(() => {
        //         toast.error("Failed to create board")
        //         onOpen();
        //     })
    }
    return (
        // <button disabled={disabled}
        //     onClick={onClick}
        //     className={cn(
        //         "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6"
        //         , (pending || disabled) && "opacity-75 hover:bg-blue-600 cursor-not-allowed")}
        // >
        //     <div />
        //     <Plus className="h-12 w-12 text-white stroke-1" />
        //     <p className="text-sm text-white font-light">
        //         New board
        //     </p>
        // </button>
        <button disabled={disabled}
            onClick={onClick}
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
    )
}
