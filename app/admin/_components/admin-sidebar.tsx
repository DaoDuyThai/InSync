"use client"

import * as React from "react"
import { CalendarCog, ChartSpline, ChevronRight, CircleDollarSign, FileCog, FolderCog, House, UserCog, } from "lucide-react"
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
  categoryName: string | null
}

export function AdminSidebar() {

  const [pages, setPages] = React.useState<Page[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [pageLoading, setPageLoading] = React.useState<boolean>(true)
  const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = React.useState<boolean>(false)
  const [newCreatePageTitle, setNewCreatePageTitle] = React.useState<string>("")
  const [newCreatePageSlug, setNewCreatePageSlug] = React.useState<string>("")
  const [createPageButtonPending, setCreatePageButtonPending] = React.useState<boolean>(false)

  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = React.useState<boolean>(false)
  const [newCreateCategoryTitle, setNewCreateCategoryTitle] = React.useState<string>("")
  const [newCreateCategoryOrder, setNewCreateCategoryOrder] = React.useState<string>("")
  const [newCreateCategoryDescription, setNewCreateCategoryDescription] = React.useState<string>("")
  const [createCategoryButtonPending, setCreateCategoryButtonPending] = React.useState<boolean>(false)

  const fetchCategories = async () => {
    setPageLoading(true)
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
      setPageLoading(false)
    }
  }


  const fetchPages = async () => {
    setPageLoading(true)
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
      setPageLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPages()
    fetchCategories()
  }, [])

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
                  <SidebarMenuButton>
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
                  <SidebarMenuButton>
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
                  <SidebarMenuButton>
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
                            <SidebarMenuSubButton className="cursor-pointer" href={`/admin/pages/${page.slug}`}>
                              {page.title.length >= 20 ? `${page.title.substring(0, 17)}...` : page.title}
                            </SidebarMenuSubButton>
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
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton className="cursor-pointer">
                                <span onClick={() => {
                                  window.location.href = `/admin/docscategory/${category.id}`
                                }}>{category.title.length >= 20 ? `${category.title.substring(0, 17)}...` : category.title}</span>
                                {category.documents?.length === 0 ? null : <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />}
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="ml-2">
                              {category.documents?.map((doc) => (
                                <SidebarMenuSub key={doc.id}>
                                  <SidebarMenuSubButton
                                    className="cursor-pointer"
                                    href={`/admin/docs/${doc.slug}`}
                                  >
                                    {doc.title.length >= 20 ? `${doc.title.substring(0, 17)}...` : doc.title}
                                  </SidebarMenuSubButton>
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
                            <Button size={"sm"} variant={"outline"} className="cursor-pointer">New Document Category</Button>
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

  )
}
