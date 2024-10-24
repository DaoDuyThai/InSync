import { Navbar } from "@/components/navbar";
import { ProjectSidebar } from "@/components/project-sidebar";

type Props = {
    children: React.ReactNode
}

const LogLayout = ({ children }: Props) => {
    return (
        <main className="h-screen w-screen">
            {children}
        </main>
    );
}

export default LogLayout;