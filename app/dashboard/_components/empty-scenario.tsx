"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useOrganization } from "@clerk/nextjs"
// import { useApiMutation } from "@/hooks/use-api-mutation"
import { toast } from "sonner"
import { ProjectSettings } from "./project-settings"

interface EmptyScenarioProps {
    onClick: () => void
}

export const EmptyScenario = ({
    onClick
}: EmptyScenarioProps) => {

    return (
        <div className="w-full h-full md-overflow-y-auto">
            <div className='flex justify-end align-middle'>
                {/* TODO: Add functionality menu for project settings */}
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
                    {/* <Button disabled={pending} onClick={onClick} size="lg">
                    Create board
                </Button> */}
                    <Button onClick={onClick} size="lg">
                        Create Scenario
                    </Button>
                </div>

            </div>
        </div>

    )
}