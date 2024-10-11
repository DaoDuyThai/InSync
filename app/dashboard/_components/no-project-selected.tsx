import Image from "next/image"
import { ProjectSettings } from "./project-settings"

export const NoProjectSelected = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image src="/no-project-selected.svg" height={400} width={400} alt="Empty" />
            <h2 className="text-2xl font-semibold mt-6">
                No project selected!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Please try to select or create a new project!
            </p>
        </div>
    )
}