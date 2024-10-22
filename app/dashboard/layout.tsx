import { Navbar } from "@/components/navbar";
import { ProjectSidebar } from "@/components/project-sidebar";

type Props = {
    children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <main className="w-screen md:w-full">

            <div className="flex gap-x-3 h-screen overflow-hidden">
                <ProjectSidebar />
                <div className="flex-1">
                    <Navbar searchEntity="Scenario" searchLink="dashboard"/>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default DashboardLayout;