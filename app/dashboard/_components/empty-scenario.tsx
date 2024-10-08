"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useOrganization } from "@clerk/nextjs"
// import { useApiMutation } from "@/hooks/use-api-mutation"
import { toast } from "sonner"

export const EmptyScenario = () => {
    const { organization } = useOrganization()
    // const { mutate, pending } = useApiMutation(api.board.create);
    const onClick = () => {
        if (!organization) return;
        // mutate({
        //     orgId: organization.id,
        //     title: "untitled"
        // })
        // .then((id) =>{
        //     toast.success("Board created")
        //     //TODO: redirect to board/{id}
        // })
        // .catch(() =>{
        //     toast.error("Failed to create board")
        // })
    }
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image src="/empty-scenario.svg" height={110} width={100} alt="Empty" />
            <h2 className="text-2xl font-semibold mt-6">
                Create your first scenario
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating a scenario for your project
            </p>
            <div className="mt-6">
                {/* <Button disabled={pending} onClick={onClick} size="lg">
                    Create board
                </Button> */}
                <Button onClick={onClick} size="lg">
                    Create Scenario
                </Button>
            </div>

        </div>
    )
}