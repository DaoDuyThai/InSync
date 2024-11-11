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

type Pages = {
  id: string
  slug: string
  title: string
  content: string
  note: string | null
  dateCreated: string | null
  dateUpdated: string | null
}

export function AdminSidebar() {

  const [pages, setPages] = React.useState<Pages[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = React.useState<boolean>(false)
  const [newCreatePageTitle, setNewCreatePageTitle] = React.useState<string>("")
  const [newCreatePageSlug, setNewCreatePageSlug] = React.useState<string>("")



  const fetchPages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages`)
      if (response.ok) {
        const data = await response.json()

        const sortedPages = data.sort((a: Pages, b: Pages) => a.title.localeCompare(b.title))

        setPages(sortedPages)
      } else {
        console.error("Error fetching data")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPages()
  }, [])

  const handleCreatePage = async (e: React.FormEvent) => {
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
        fetchPages() // Refetch the pages after adding
        setIsCreatePageDialogOpen(false) // Close the dialog
      } else {
        console.error("Error creating page")
      }
    } catch (error) {
      console.error("Error:", error)
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
                      <SidebarMenuSub key={page.id}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="cursor-pointer" href={`/admin/pages/${page.slug}`}>
                            {page.title.length >= 20 ? `${page.title.substring(0, 17)}...` : page.title}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    ))}
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <Dialog open={isCreatePageDialogOpen} onOpenChange={setIsCreatePageDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size={"sm"} className="cursor-pointer">Create New Page</Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Page</DialogTitle>
                              <DialogDescription>Enter data to create a new page.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreatePage}>
                              <div className="grid gap-4 py-4">
                                <Input
                                  type="text"
                                  placeholder="Page Slug"
                                  value={newCreatePageSlug}
                                  onChange={(e) => setNewCreatePageSlug(e.target.value)}
                                  minLength={2}
                                  required
                                />
                                <Input
                                  type="text"
                                  placeholder="Page Title"
                                  value={newCreatePageTitle}
                                  onChange={(e) => setNewCreatePageTitle(e.target.value)}
                                  minLength={2}
                                  required
                                />
                              </div>
                              <DialogFooter className="">
                                <Button variant="outline" onClick={() => setIsCreatePageDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Page</Button>
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
                    <SidebarMenuButton >
                      <Hint label="Docs Management" side="right">
                        <FileCog />
                      </Hint>
                      Docs Management{" "}
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <SidebarMenuSubButton className="cursor-pointer" href="/admin/docs">
                          Introduction
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <SidebarMenuSubButton className="cursor-pointer" href="/admin/docs">
                          Installation
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <SidebarMenuSubButton className="cursor-pointer" href="/admin/docs">
                          Docs
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <SidebarMenuSubButton className="cursor-pointer" href="/admin/docs">
                          Examples
                        </SidebarMenuSubButton>
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
