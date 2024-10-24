"use client"

import * as React from "react"
import { CalendarCog, ChartSpline, ChevronRight, CircleDollarSign, FileCog, FolderCog, UserCog, } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

export function AdminSidebar() {

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

        <SidebarGroup className="group-data-[collapsible=icon]:visible">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/admin">
                  <SidebarMenuButton>
                    <ChartSpline />
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
                <Link href="/admin">
                  <SidebarMenuButton>
                    <CircleDollarSign />
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
                <Link href="/admin">
                  <SidebarMenuButton>
                    <UserCog />
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
                <Link href="/admin">
                  <SidebarMenuButton>
                    <FolderCog />
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
                <Link href="/admin">
                  <SidebarMenuButton>
                    <CalendarCog />
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
                      <FolderCog />
                      Pages Management{" "}
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <SidebarMenuSubButton className="cursor-pointer" href="/admin/about">
                          About Us
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <SidebarMenuSubButton className="cursor-pointer" href="/admin/term">
                          Term of Service
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <SidebarMenuSubButton className="cursor-pointer" href="/admin/policy">
                          Privacy Policy
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem >
                        <SidebarMenuSubButton className="cursor-pointer" href="/admin/faq">
                          FAQs
                        </SidebarMenuSubButton>
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
                      <FileCog />
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
