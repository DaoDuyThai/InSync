import Image from "next/image"

export const NoProjectSelected = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center md-overflow-y-auto">
            <Image src="/no-project-selected.svg" height={300} width={300} alt="Empty" />
            <h2 className="text-2xl font-semibold mt-6">
                No project selected!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Please try to select or create a new project!
            </p>
        </div>
    )
}