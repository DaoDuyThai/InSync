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
    onClick: () => void
}

export const NewScenarioButton = ({
    onClick
}: NewScenarioButtonProps) => {
    // TODO: Pro Mode
    // const { onOpen } = useProModal();
    // TODO: Create board
    // const { mutate, pending } = useApiMutation(api.board.create);

    
    return (
        <button
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
