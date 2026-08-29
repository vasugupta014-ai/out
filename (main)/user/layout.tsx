import type { ReactNode } from "react";

import { cookies } from "next/headers";
import Link from "next/link";

import { siGithub } from "simple-icons";

import { AppSidebar } from "@/app/(main)/user/_components/sidebar/app-sidebar";
import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";

import { AccountSwitcher } from "./_components/sidebar/account-switcher";
import { LayoutControls } from "./_components/sidebar/layout-controls";
import { SearchDialog } from "./_components/sidebar/search-dialog";
import { ThemeSwitcher } from "./_components/sidebar/theme-switcher";

import PageTransition from '@/components/PageTransition'
import { ScrollToTop } from "@/components/scroll-to-top";

import { updateMetaThemeColor } from "@/lib/utils"
import { redirect } from 'next/navigation'



export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = process.env.MONGODB_URI;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
  // const [ user ] =  await Promise.all([
  //   getPreference("user_status"),
  // ]);

  // if (user == "0" || !user) {
  //   redirect('/user/login')   
  // }
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible] = await Promise.all([
    getPreference("sidebar_variant"),
    getPreference("sidebar_collapsible"),
  ]);

  updateMetaThemeColor();

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant={variant} collapsible={collapsible} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&>*]:mx-auto",
          "[html[data-content-layout=centered]_&>*]:w-full",
          "[html[data-content-layout=centered]_&>*]:max-w-screen-2xl",
          "peer-data-[variant=inset]:border",
          "[--dashboard-header-height:--spacing(12)]",
          "min-w-0 h-dvh flex flex-col",
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
              />
              <SearchDialog />
            </div>
            <div className="flex items-center gap-1">
              <LayoutControls />
              <ThemeSwitcher />
              {/* <Button
                size="icon"
                nativeButton={false}
                render={
                  <Link
                    prefetch={false}
                    href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open GitHub repository"
                  />
                }
              >
                <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
              </Button> */}
              <AccountSwitcher users={users} />
            </div>
          </div>
        </header>
        <ScrollToTop>
          {/* Pages can set data-content-padding="false" to render full-bleed app layouts. */}
          <div className="min-w-0 p-4 mt-[calc(var(--spacing)*12)] has-data-[content-padding=false]:p-0 md:has-data-[content-padding=false]:p-0">
            <PageTransition>{children}</PageTransition>
          </div>
        </ScrollToTop>
      </SidebarInset>
    </SidebarProvider>
  );
}
