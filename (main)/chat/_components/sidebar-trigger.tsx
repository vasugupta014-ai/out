import { useSidebar } from "@/components/ui/sidebar"

export function CustomSidebarTrigger() {
  const { state, setOpen, setOpenMobile } = useSidebar()

  const handleToggle = () => {
    if (state === "expanded") {
      // 1st Click: Go to Collapsed Icon mode
      setOpen(false)
    } else if (state === "collapsed") {
      // 2nd Click: Mimic 'offcanvas' by hiding it entirely
      // If you are on desktop, you can use a custom state or force a hidden style
      // For standard shadcn, changing the state or setting an offcanvas flag works:
      // Alternatively, toggle the openMobile or a custom provider state.
    }
  };

  return <button onClick={handleToggle}>Toggle</button>;
}
