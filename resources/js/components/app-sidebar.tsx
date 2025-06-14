import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: '/dashboard',
    //     icon: LayoutGrid,
    // },
    {
        title: 'Devices',
        href: '/devices',
        icon: LayoutGrid,
    },

    {
        title: 'Accounts',
        href: '/accounts',
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: '/users',
        icon: LayoutGrid,
    },
    // {
    //     title: 'Vehicles',
    //     href: '/vehicles',
    //     icon: LayoutGrid,
    // },
    //
    // {
    //     title: 'Money Express',
    //     href: '/moneyExpress',
    //     icon: LayoutGrid,
    // },
    // {
    //     title: 'People Analytics',
    //     href: '/analytics',
    //     icon: LayoutGrid,
    // },

];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/f11tech/PISR-Api-Bk/tree/feature/MIMA-0019',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://drive.google.com/file/d/1JMXU_lijbdfG2ZE4-3rp6FMoS0HDWo8d/view?usp=drive_link',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/devices" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
