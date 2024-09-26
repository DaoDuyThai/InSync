import { Navbar } from "./_components/navbar";
import { ProjectSidebar } from "@/components/project-sidebar";
import Toolkit from "./_components/toolkit";

type Props = {
    children: React.ReactNode
}

const ImageLayout = ({ children }: Props) => {
    return (
        <main className="h-full">
            <div className="flex gap-x-3 h-full">
                <ProjectSidebar />
                <div className="h-full flex-1">
                    <Navbar />
                    {children}
                </div>
            </div>
        </main>
    );
}

export default ImageLayout;