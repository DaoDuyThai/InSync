// import { Navbar } from "@/components/navbar";
// import { ProjectSidebar } from "@/components/project-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/admin-sidebar"


type Props = {
    children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
    return (

        <AdminSidebar />

    )
}

export default AdminLayout;