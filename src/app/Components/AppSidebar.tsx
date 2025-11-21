// AppSidebar.jsx
import React from "react";
import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";
import { House, Inbox, Calendar, Search, Settings } from "lucide-react";

const items = [
    { title: "Home", url: "/", icon: House },
    { title: "Inbox", url: "/inbox", icon: Inbox },
    { title: "Calendar", url: "/calendar", icon: Calendar },
    { title: "Search", url: "/search", icon: Search },
    { title: "Settings", url: "/settings", icon: Settings }
];

export default function AppSidebar() {
    return (
        <Sidebar collapsible="icon" side="left" variant="sidebar">
            <SidebarHeader>
                <div className="px-3 py-2 fs-4 fw-bold">DIVLAB</div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(i => (
                                <SidebarMenuItem key={i.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={i.url} className="d-flex align-items-center ps-3 py-2">
                                            <i className="me-2">
                                                <i /* or <i> placeholder for icon */ />
                                                <i className={`icon-${i.title.toLowerCase()}`} />
                                            </i>
                                            <span>{i.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <a href="/logout" className="d-flex align-items-center ps-3 py-2">
                    <i className="me-2">
                        <Settings />
                    </i>
                    <span>Sign Out</span>
                </a>
            </SidebarFooter>
        </Sidebar>
    );
}