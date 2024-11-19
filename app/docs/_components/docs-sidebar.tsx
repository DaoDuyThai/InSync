'use client'

import * as React from "react"
import { Check, ChevronRight, ChevronsUpDown, GalleryVerticalEnd, Search, } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger, } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
    categoryId: string | null
    order: number
    categoryName: string | null
}

export function DocsSidebar() {
    const [categories, setCategories] = React.useState<Category[]>([])
    const [searchTerm, setSearchTerm] = React.useState("")
    const [pageLoading, setPageLoading] = React.useState<boolean>(true)

    const pathname = usePathname()

    // Get the full domain (protocol + domain + port)
    const fullDomain = typeof window !== 'undefined' ? window.location.origin : ''

    // Construct the full URL (domain + pathname + query params)
    const fullUrl = `${fullDomain}${pathname}`

    const fetchCategories = async () => {
        setPageLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorydocument/pagination`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    }
                }
            )
            if (response.ok) {
                const data = await response.json()
                console.log(data.data)
                setCategories(data.data)
            } else {
                console.error("Error fetching documents")
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setPageLoading(false)
        }
    }

    React.useEffect(() => {
        fetchCategories()
    }, [])

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
                                            <SidebarMenuItem key={doc.id}>
                                                <Link href={`/docs/${doc.slug}`}>
                                                    <SidebarMenuButton
                                                        isActive={fullUrl === `${fullDomain}/docs/${doc.slug}`}
                                                    >
                                                        {doc.title.length >= 28 ? `${doc.title.substring(0, 25)}...` : doc.title}
                                                    </SidebarMenuButton>
                                                </Link>
                                            </SidebarMenuItem>
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
    )
}