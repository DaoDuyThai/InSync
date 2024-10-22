// import { Navbar } from "@/components/navbar";
// import { ProjectSidebar } from "@/components/project-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"


type Props = {
    children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4">
                    
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>







    )
}

export default AdminLayout;