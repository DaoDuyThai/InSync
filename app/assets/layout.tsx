import { Suspense } from "react";
import { Navbar } from "./_components/navbar";
import { ProjectSidebar } from "@/components/project-sidebar";
import { Loading } from "@/components/loading";

type Props = {
    children: React.ReactNode
}

const ImageLayout = ({ children }: Props) => {
    return (
        <main className="h-full">
            <Suspense fallback={<Loading/>}>
                <div className="flex gap-x-3 h-full">
                    <ProjectSidebar />
                    <div className="h-full flex-1">
                        <Navbar />
                        {children}
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default ImageLayout;