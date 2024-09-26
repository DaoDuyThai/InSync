import { Navbar } from "./_components/navbar";
import { ProjectSidebar } from "@/components/project-sidebar";

type Props = {
    children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <main className="h-full w-screen md:w-full">

            <div className="flex gap-x-3 h-full">
                <ProjectSidebar />
                <div className="h-full flex-1">
                    <Navbar />
                    {children}
                </div>
            </div>
        </main>
    )
}

export default DashboardLayout;