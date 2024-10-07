import { Navbar } from "@/components/navbar";
import { ProjectSidebar } from "@/components/project-sidebar";

type Props = {
    children: React.ReactNode
}

const DeviceLayout = ({ children }: Props) => {
    return (
        <main className="h-full">
            <div className="flex gap-x-3 h-full">
                <ProjectSidebar />
                <div className="h-full flex-1">
                    <Navbar searchEntity="Assets" searchLink="devices"/>
                    {children}
                </div>
            </div>
        </main>
    );
}

export default DeviceLayout;