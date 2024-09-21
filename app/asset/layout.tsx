import { Navbar } from "./_components/navbar";
import { ProjectSidebar } from "./_components/project-sidebar";
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
                    <div className="flex justify-center gap-10">
                        {children}
                        <Toolkit/>
                    </div>
                    
                </div>
            </div>
        </main>
    );
}

export default ImageLayout;