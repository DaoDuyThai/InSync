"use client"

import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { Check, ArrowRight, Loader, ChevronRight, ChevronsUpDown, GalleryVerticalEnd, Search, } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider, SidebarRail, SidebarTrigger, } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
    children: React.ReactNode
}

type Category = {
    id: string
    title: string
    order: number
    description: string | null
    dateCreated: string | null
    dateUpdated: string | null
    documents: Doc[] | null
}

type Doc = {
    id: string
    slug: string
    title: string
    content: string
    note: string
    dateCreated: string | null
    dateUpdated: string | null
    categoryId: string
    order: number
    categoryName: string
}

const DocsLayout = ({ children }: Props) => {
    const [categories, setCategories] = React.useState<Category[]>([])
    const [searchTerm, setSearchTerm] = React.useState("")

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
                // console.log(data.data)
                setCategories(data.data)
            } else {
                console.error("Error fetching documents")
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
        }
    }

    React.useEffect(() => {
        fetchCategories()
    }, [])

    React.useEffect(() => {
        if(!pathname) return;
        const docsSlugMatch = pathname.match(/docs\/([^/]+)/); // Match the slug for docs
        if (docsSlugMatch) {
            // If we are on a docs slug, set breadcrumb to the doc title
            const slug = docsSlugMatch[1];
            const doc = categories.flatMap((c) => c.documents).find((d) => d && d.slug === slug);
            if (doc) {
                setBreadcrumbTitle1(doc.categoryName); // Set breadcrumb title to "Docs Management"
                setBreadcrumbUrl1(`/docs`); // Set breadcrumb title to category name
                setBreadcrumbTitle2(doc.title); // Set breadcrumb title to document title
            }
        } else {
            setBreadcrumbTitle1(""); // Set breadcrumb title to ""
            setBreadcrumbUrl1(""); // Set breadcrumb title to ""
            setBreadcrumbTitle2(""); // Set breadcrumb title to ""
        }
    }, [pathname, categories]);

    const filterCategories = (categories: Category[], searchTerm: string): Category[] => {
        return categories.map(category => ({
            ...category,
            documents: category.documents?.filter(doc =>
                doc.title.toLowerCase().includes(searchTerm.toLowerCase())
            ) || null
        })).filter(category => category.documents && category.documents.length > 0)
    }

    const filteredCategories = React.useMemo(() =>
        filterCategories(categories, searchTerm),
        [categories, searchTerm]
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/">
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <GalleryVerticalEnd className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">Documentation</span>
                                    </div>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <SidebarGroup className="py-0">
                            <SidebarGroupContent className="relative">
                                <Label htmlFor="search" className="sr-only">
                                    Search
                                </Label>
                                <SidebarInput
                                    id="search"
                                    placeholder="Search the docs..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </form>
                </SidebarHeader>
                <SidebarContent className="gap-0">
                    {filteredCategories.map((category) => (
                        <Collapsible key={category.id} defaultOpen className="group/collapsible">
                            <SidebarGroup>
                                <SidebarGroupLabel
                                    asChild
                                    className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                >
                                    <CollapsibleTrigger>
                                        {category.title.length >= 25 ? `${category.title.substring(0, 22)}...` : category.title}
                                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {category.documents?.map((doc) => (
                                                <SidebarMenuSub key={doc.id}>
                                                    <Link href={`/docs/${doc.slug}`}>
                                                        <SidebarMenuButton
                                                            isActive={fullUrl === `${fullDomain}/docs/${doc.slug}`}
                                                        >
                                                            {doc.title.length >= 28 ? `${doc.title.substring(0, 25)}...` : doc.title}
                                                        </SidebarMenuButton>
                                                    </Link>
                                                </SidebarMenuSub>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    ))}
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
                                    <Link href="/docs">Documentation</Link>
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
                            <div className="flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                                <div className="h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                    <SignOutButton redirectUrl="/"></SignOutButton>
                                </div>
                                <Link href="/dashboard">
                                    <Button variant={"default"}>
                                        Go to dashboard <ArrowRight />
                                    </Button>
                                </Link>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                                    <Button variant={"ghost"}>Sign In</Button>
                                </SignInButton>
                                <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                                    <Button >Get InSync for free</Button>
                                </SignUpButton>
                            </div>
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

export default DocsLayout;