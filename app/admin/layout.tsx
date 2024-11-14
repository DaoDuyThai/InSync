"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import * as React from "react"
import { CalendarCog, ChartSpline, Loader, ChevronRight, CircleDollarSign, FileCog, FolderCog, House, UserCog, } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { Hint } from "@/components/hint"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/loading"
import { set } from "date-fns"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { usePathname, useSearchParams } from "next/navigation"


type Props = {
    children: React.ReactNode
}

type Page = {
    id: string
    slug: string
    title: string
    content: string
    note: string | null
    dateCreated: string | null
    dateUpdated: string | null
}

type Category = {
    id: string
    title: string
    order: number
    description: string | null
    dateCreated: string | null
    dateUpdated: string | null
    documents: Docs[] | null
}

type Docs = {
    id: string
    slug: string
    title: string
    content: string
    note: string
    dateCreated: string | null
    dateUpdated: string | null
    categoryId: string | null
    order: number
    categoryName: string
}

const AdminLayout = ({ children }: Props) => {
    const [pages, setPages] = React.useState<Page[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])
    const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = React.useState<boolean>(false)
    const [newCreatePageTitle, setNewCreatePageTitle] = React.useState<string>("")
    const [newCreatePageSlug, setNewCreatePageSlug] = React.useState<string>("")
    const [createPageButtonPending, setCreatePageButtonPending] = React.useState<boolean>(false)

    const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = React.useState<boolean>(false)
    const [newCreateCategoryTitle, setNewCreateCategoryTitle] = React.useState<string>("")
    const [newCreateCategoryOrder, setNewCreateCategoryOrder] = React.useState<string>("")
    const [newCreateCategoryDescription, setNewCreateCategoryDescription] = React.useState<string>("")
    const [createCategoryButtonPending, setCreateCategoryButtonPending] = React.useState<boolean>(false)

    const pathname = usePathname()
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true); // Set to true only after component mounts
    }, []);

    // Get the full domain (protocol + domain + port)
    const fullDomain = typeof window !== 'undefined' ? window.location.origin : ''

    // Construct the full URL (domain + pathname + query params)
    const fullUrl = `${fullDomain}${pathname}`

    const [breadcrumbTitle1, setBreadcrumbTitle1] = React.useState<string>("")
    const [BreadcrumbUrl1, setBreadcrumbUrl1] = React.useState<string>("")
    const [breadcrumbTitle2, setBreadcrumbTitle2] = React.useState<string>("")


    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorydocument/pagination`)
            if (response.ok) {
                const data = await response.json()
                setCategories(data.data)
            } else {
                console.error("Error fetching documents")
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
        }
    }


    const fetchPages = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages`)
            if (response.ok) {
                const data = await response.json()

                const sortedPages = data.sort((a: Page, b: Page) => a.title.localeCompare(b.title))

                setPages(sortedPages)
            } else {
                console.error("Error fetching pages")
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
        }
    }

    React.useEffect(() => {
        fetchPages()
        fetchCategories()
    }, [])

    React.useEffect(() => {
        if (!pathname) return;

        const pageSlugMatch = pathname.match(/pages\/([^/]+)/); // Match the slug for pages
        const docsSlugMatch = pathname.match(/docs\/([^/]+)/); // Match the slug for docs
        const docsCategoryIdMatch = pathname.match(/docscategory\/([^/]+)/); // Match the slug for docs category
        if (pageSlugMatch) {
            // If we are on a page slug, set breadcrumb to the page title
            const slug = pageSlugMatch[1];
            const page = pages.find((p) => p.slug === slug);
            if (page) {
                setBreadcrumbTitle1("Pages Management"); // Set breadcrumb title to "Pages Management"
                setBreadcrumbTitle2(page.title); // Set breadcrumb title to page title
            }
        } else if (docsSlugMatch) {
            // If we are on a docs slug, set breadcrumb to the doc title
            const slug = docsSlugMatch[1];
            const doc = categories.flatMap((c) => c.documents).find((d) => d && d.slug === slug);
            if (doc) {
                setBreadcrumbTitle1("Docs Management"); // Set breadcrumb title to "Docs Management"
                setBreadcrumbUrl1(`/admin/docscategory/${doc.categoryId}`); // Set breadcrumb title to category name
                setBreadcrumbTitle2(doc.title); // Set breadcrumb title to document title
            }
        } else if (docsCategoryIdMatch) {
            const categoryId = docsCategoryIdMatch[1]
            const category = categories.find((c) => c.id === categoryId)
            if (category) {
                setBreadcrumbTitle1("Docs Management")
                setBreadcrumbTitle2("")
            }
        }

        else {
            // Handle other routes or default breadcrumb
            switch (pathname) {
                case "/admin":
                    setBreadcrumbTitle2("Overview");
                    break;
                case "/admin/projects":
                    setBreadcrumbTitle2("Projects Management");
                    break;
                case "/admin/subscriptions":
                    setBreadcrumbTitle2("Subscriptions Management");
                    break;
                default:
                    setBreadcrumbTitle1("Admin Dashboard"); // Default breadcrumb
                    setBreadcrumbTitle2(""); // Default breadcrumb
            }
        }
    }, [pathname, pages, categories]);

    const handleCreatePage = async (e: React.FormEvent) => {
        setCreatePageButtonPending(true)
        e.preventDefault()

        const newPage = {
            title: newCreatePageTitle,
            slug: newCreatePageSlug,
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPage),
            })

            if (response.ok) {
                toast.success("Page created successfully")
                fetchPages() // Refetch the pages after adding
                setIsCreatePageDialogOpen(false) // Close the dialog
            } else {
                toast.error("Error creating page")
                console.error("Error creating page")
            }
        } catch (error) {
            toast.error("Error creating page")
            console.error("Error:", error)
        } finally {
            setCreatePageButtonPending(false)
        }
    }

    const handleCreateCategory = async (e: React.FormEvent) => {
        setCreateCategoryButtonPending(true)
        e.preventDefault()

        const newCategory = {
            title: newCreateCategoryTitle,
            order: newCreateCategoryOrder,
            description: newCreateCategoryDescription,
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorydocument`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCategory),
            })

            if (response.ok) {
                toast.success("Category created successfully")
                fetchCategories() // Refetch the categories after adding
                setIsCreateCategoryDialogOpen(false) // Close the dialog
            } else {
                toast.error("Error creating category")
                console.error("Error creating category")
            }
        } catch (error) {
            toast.error("Error creating category")
            console.error("Error:", error)
        } finally {
            setCreateCategoryButtonPending(false)
        }
    }

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader >
                    <SidebarMenu className="group-data-[collapsible=icon]:hidden">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Link href="/">
                                    <Image priority src="/logo.svg" alt="logo" height={40} width={40} />
                                </Link>
                                <Link href="/admin">
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">Administration</span>
                                    </div>
                                </Link>

                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                </SidebarHeader>
                <SidebarContent >
                    <SidebarGroup className="group-data-[collapsible=icon]:visible group-data-[collapsible=icon]:pt-14">
                        <SidebarGroupContent>
                            <SidebarMenu>

                                <SidebarMenuItem>
                                    <Link href="/admin">
                                        <SidebarMenuButton isActive={fullUrl === `${fullDomain}/admin`}>
                                            <Hint label="Overview" side="right">
                                                <ChartSpline />
                                            </Hint>
                                            Overview{" "}
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className="group-data-[collapsible=icon]:visible">
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <Link target="_blank" href="https://dashboard.stripe.com/test/payments">
                                        <SidebarMenuButton>
                                            <Hint label="Revenue Stream" side="right">
                                                <CircleDollarSign />
                                            </Hint>
                                            Revenue Stream{" "}
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className="group-data-[collapsible=icon]:visible">
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <Link target="_blank" href="https://dashboard.clerk.com/apps/app_2kbW1OvrtyILeR6bpqw2DrSzsBP/instances/ins_2kbW1PFE9yt3wdELemX8oiVQG1O">
                                        <SidebarMenuButton>
                                            <Hint label="Users Management" side="right">
                                                <UserCog />
                                            </Hint>
                                            Users Management{" "}
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className="group-data-[collapsible=icon]:visible">
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <Link href="/admin/projects">
                                        <SidebarMenuButton isActive={fullUrl === `${fullDomain}/admin/projects`}>
                                            <Hint label="Projects Management" side="right">
                                                <FolderCog />
                                            </Hint>
                                            Projects Management{" "}
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className="group-data-[collapsible=icon]:visible">
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <Link href="/admin/subscriptions">
                                        <SidebarMenuButton isActive={fullUrl === `${fullDomain}/admin/subscriptions`}>
                                            <Hint label="Subscriptions Management" side="right">
                                                <CalendarCog />
                                            </Hint>
                                            Subscriptions Management{" "}
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>


                    <SidebarGroup className="group-data-[collapsible=icon]:visible">
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <Collapsible defaultOpen className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton >
                                                <Hint label="Pages Management" side="right">
                                                    <FolderCog />
                                                </Hint>
                                                Pages Management{" "}
                                                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            {pages.map((page) => (
                                                <Hint label={`/pages/${page.slug}`} key={page.id} side="right">
                                                    <SidebarMenuSub >
                                                        <SidebarMenuSubItem>
                                                            <Link href={`/admin/pages/${page.slug}`}>
                                                                <SidebarMenuButton isActive={fullUrl === `${fullDomain}/admin/pages/${page.slug}`} className="cursor-pointer" >
                                                                    {page.title.length >= 20 ? `${page.title.substring(0, 17)}...` : page.title}
                                                                </SidebarMenuButton>
                                                            </Link>
                                                        </SidebarMenuSubItem>
                                                    </SidebarMenuSub>
                                                </Hint>

                                            ))}
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem >
                                                    <Dialog open={isCreatePageDialogOpen} onOpenChange={setIsCreatePageDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button size={"sm"} variant={"outline"} className="cursor-pointer">New Page</Button>
                                                        </DialogTrigger>

                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Create New Page</DialogTitle>
                                                                <DialogDescription>Enter data to create a new page.</DialogDescription>
                                                            </DialogHeader>
                                                            <form onSubmit={handleCreatePage} className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="pageSlug" className="text-right">Page Slug</Label>
                                                                    <Input
                                                                        id="pageSlug"
                                                                        type="text"
                                                                        placeholder="Page Slug"
                                                                        onChange={(e) => setNewCreatePageSlug(e.target.value)}
                                                                        minLength={2}
                                                                        required
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="pageTitle" className="text-right">Page Title</Label>
                                                                    <Input
                                                                        id="pageTitle"
                                                                        type="text"
                                                                        placeholder="Page Title"
                                                                        onChange={(e) => setNewCreatePageTitle(e.target.value)}
                                                                        minLength={2}
                                                                        required
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                                <DialogFooter className="">
                                                                    <Button variant="outline" onClick={() => setIsCreatePageDialogOpen(false)}>Cancel</Button>
                                                                    <Button disabled={createPageButtonPending} type="submit">Create Page</Button>
                                                                </DialogFooter>
                                                            </form>
                                                        </DialogContent>
                                                    </Dialog>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className="group-data-[collapsible=icon]:visible">
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <Collapsible defaultOpen className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton>
                                                <Hint label="Docs Management" side="right">
                                                    <FileCog />
                                                </Hint>
                                                Docs Management
                                                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            {categories.map((category) => (
                                                <Collapsible key={category.id} defaultOpen className="group/collapsible">
                                                    <SidebarMenuSub>
                                                        <SidebarMenuSubItem>
                                                            <Link href={`/admin/docscategory/${category.id}`}>
                                                                <SidebarMenuButton isActive={fullUrl === `${fullDomain}/admin/docscategory/${category.id}`} className="cursor-pointer">
                                                                    {category.title.length >= 20 ? `${category.title.substring(0, 17)}...` : category.title}
                                                                    <CollapsibleTrigger asChild>
                                                                        {category.documents?.length === 0 ? null : <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />}
                                                                    </CollapsibleTrigger>
                                                                </SidebarMenuButton>
                                                            </Link>
                                                            <CollapsibleContent className="ml-2">
                                                                {category.documents?.map((doc) => (
                                                                    <SidebarMenuSub key={doc.id}>
                                                                        <Link href={`/admin/docs/${doc.slug}`}>
                                                                            <SidebarMenuButton
                                                                                isActive={fullUrl === `${fullDomain}/admin/docs/${doc.slug}`}
                                                                                className="cursor-pointer"
                                                                            >
                                                                                {doc.title.length >= 20 ? `${doc.title.substring(0, 17)}...` : doc.title}
                                                                            </SidebarMenuButton>
                                                                        </Link>
                                                                    </SidebarMenuSub>
                                                                ))}
                                                            </CollapsibleContent>
                                                        </SidebarMenuSubItem>
                                                    </SidebarMenuSub>
                                                </Collapsible>
                                            ))}
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem >
                                                    <Dialog open={isCreateCategoryDialogOpen} onOpenChange={setIsCreateCategoryDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button size={"sm"} variant={"outline"} className="cursor-pointer">New Category</Button>
                                                        </DialogTrigger>

                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Create New Document Category</DialogTitle>
                                                                <DialogDescription>Enter data to create a new document category.</DialogDescription>
                                                            </DialogHeader>
                                                            <form onSubmit={handleCreateCategory} className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="categoryTitle" className="text-right">Category Title</Label>
                                                                    <Input
                                                                        id="categoryTitle"
                                                                        type="text"
                                                                        placeholder="Category Title"
                                                                        onChange={(e) => setNewCreateCategoryTitle(e.target.value)}
                                                                        minLength={2}
                                                                        required
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="categoryDescription" className="text-right">Category Description</Label>
                                                                    <Input
                                                                        id="categoryDescription"
                                                                        type="text"
                                                                        placeholder="Description"
                                                                        onChange={(e) => setNewCreateCategoryDescription(e.target.value)}
                                                                        minLength={2}
                                                                        required
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="categoryOrder" className="text-right">Category Order</Label>
                                                                    <Input
                                                                        id="categoryOrder"
                                                                        type="number"
                                                                        placeholder="Order"
                                                                        onChange={(e) => setNewCreateCategoryOrder(e.target.value)}
                                                                        minLength={2}
                                                                        required
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                                <DialogFooter className="">
                                                                    <Button variant="outline" onClick={() => setIsCreateCategoryDialogOpen(false)}>Cancel</Button>
                                                                    <Button disabled={createCategoryButtonPending} type="submit">Create Page</Button>
                                                                </DialogFooter>
                                                            </form>
                                                        </DialogContent>
                                                    </Dialog>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 justify-between z-10">
                    <div className="flex gap-2 items-center ">
                        <SidebarTrigger className="ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <Link href="/admin">Administration</Link>
                                </BreadcrumbItem>
                                {mounted && (
                                    <>
                                        <BreadcrumbSeparator>
                                            <ChevronRight />
                                        </BreadcrumbSeparator>
                                        {breadcrumbTitle1 === "" ? null : (
                                            <div className="flex items-center gap-2">
                                                <BreadcrumbItem>
                                                    <Link href={BreadcrumbUrl1}>{breadcrumbTitle1}</Link>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator>
                                                    <ChevronRight />
                                                </BreadcrumbSeparator>
                                            </div>
                                        )}
                                        <BreadcrumbItem>
                                            <Link href={fullUrl}>{breadcrumbTitle2}</Link>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <ClerkLoading >
                        <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <SignedIn >
                            <UserButton />
                        </SignedIn>
                        <SignedOut>

                        </SignedOut>
                    </ClerkLoaded>
                </header>

                <div className="container">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AdminLayout;