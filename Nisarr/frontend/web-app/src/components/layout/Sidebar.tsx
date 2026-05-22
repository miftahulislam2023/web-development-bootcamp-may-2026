import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Wallet,
  StickyNote,
  Package,
  GraduationCap,
  Target,
  Sparkles,
  Settings,
  Moon,
  Sun,
  Search,
  Flag,
  HeadphonesIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  LogOut,
  PanelLeftClose,
  PanelRightClose
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: ListTodo, label: "Tasks", path: "/tasks" },
  { icon: Wallet, label: "Finance", path: "/finance" },
  { icon: StickyNote, label: "Notes", path: "/notes" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: GraduationCap, label: "Study", path: "/study" },
  { icon: Target, label: "Habits", path: "/habits" },
];

const secondaryNavItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Flag, label: "Report", path: "https://wa.me/8801602226032", external: true },
  { icon: HeadphonesIcon, label: "Support", path: "https://wa.me/8801602226032", external: true },
];

interface NavItemProps {
  item: {
    icon: any;
    label: string;
    path: string;
    badge?: string;
    badgeType?: string;
    external?: boolean;
  };
  isCollapsed: boolean;
  isActive: boolean;
}

function NavItem({ item, isCollapsed, isActive }: NavItemProps) {
  const content = (
    <div className={cn(
      "flex items-center gap-3 transition-all group relative my-1",
      "border rounded-2xl shadow-sm",
      isActive
        ? "bg-primary/10 border-primary text-primary dark:bg-primary/20"
        : "bg-secondary/40 border-border hover:bg-secondary/80 hover:border-border/80 text-muted-foreground hover:text-foreground",
      isCollapsed
        ? "justify-center px-0 w-[42px] h-[42px] mx-auto"
        : "px-3 py-2.5"
    )}>
      <item.icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", isActive ? "text-primary dark:text-primary" : "")} />

      {!isCollapsed && (
        <>
          <span className={cn("text-sm transition-all flex-1 text-left", isActive && "font-medium")}>
            {item.label}
          </span>
          {item.badge && (
            <div className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[24px] flex items-center justify-center shrink-0 z-10",
              item.badgeType === "primary" ? "bg-red-500 text-white shadow-sm" : "bg-secondary text-muted-foreground",
              isActive ? "mr-6" : ""
            )}>
              {item.badge}
            </div>
          )}
          {isActive && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-0">
              <ChevronRight className="w-4 h-4 text-primary opacity-80" />
            </div>
          )}
        </>
      )}
    </div>
  );

  if (item.external) {
    return (
      <a href={item.path} target="_blank" rel="noreferrer" title={isCollapsed ? item.label : undefined}>
        {content}
      </a>
    );
  }

  return (
    <Link to={item.path} title={isCollapsed ? item.label : undefined}>
      {content}
    </Link>
  );
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { tasks } = useTasks();

  const pendingTasksCount = tasks.filter(t => t.status !== "done").length;

  const dynamicMainNavItems = mainNavItems.map(item => {
    if (item.label === "Tasks" && pendingTasksCount > 0) {
      return { ...item, badge: pendingTasksCount.toString(), badgeType: "primary" };
    }
    return item;
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={cn(
      "hidden md:flex flex-col h-[100dvh] fixed left-0 top-0 transition-all duration-300 border-r border-border/70 z-50",
      "bg-card text-card-foreground select-none overflow-y-auto no-scrollbar",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Brand & Toggle Box */}
      <div className={cn("m-3 p-3 flex items-center bg-secondary/40 border border-border rounded-2xl shadow-sm sticky top-3 z-10 transition-all duration-300", isCollapsed ? "justify-center flex-col gap-4" : "justify-between")}>
        <div className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0" onClick={() => navigate("/dashboard")}>
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-primary/10 border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <img src="/logo.svg" alt="LifeSolver Logo" className="w-6 h-6 object-contain" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 transition-opacity duration-300 flex flex-col justify-center">
              <h1 className="text-[16px] font-bold truncate tracking-tight text-foreground leading-tight">LifeSolver</h1>
              <p className="text-[10px] text-muted-foreground font-medium truncate leading-tight mt-0.5">AI Command Center</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground bg-background border border-border hover:text-foreground hover:bg-secondary shadow-sm transition-all outline-none shrink-0"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelRightClose className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Scrollable Nav Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-6 pb-6 pt-2">
        {/* Main Menu */}
        <div className="space-y-1">
          {!isCollapsed && <p className="text-[10px] font-bold text-muted-foreground/70 px-3 mb-2 tracking-wider">MENU</p>}
          {dynamicMainNavItems.map(item => (
            <NavItem
              key={item.path}
              item={item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.path || (location.pathname === "/dashboard" && item.path === "/dashboard")}
            />
          ))}
        </div>

        {/* Secondary Menu / Examples */}
        <div className="space-y-1">
          <div className="py-3">
            <div className={cn("h-[2px] bg-border/80 rounded-full", isCollapsed ? "w-6 mx-auto" : "w-full")} />
          </div>
          {secondaryNavItems.map(item => (
            <NavItem
              key={item.label}
              item={item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      </div>

      {/* Combined Theme & User Profile Box */}
      <div className={cn("m-3 p-3 bg-secondary/40 border border-border rounded-2xl shadow-sm transition-all duration-300 sticky bottom-3 z-10 flex flex-col gap-4", isCollapsed ? "" : "")}>

        {/* Theme Toggle Strip */}
        <div className={cn(
          "flex items-center rounded-xl p-1 bg-background/50 border border-border/50",
          isCollapsed ? "flex-col gap-1 rounded-[24px]" : "gap-1"
        )}>
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-1.5 transition-all text-xs font-medium",
              theme === "light" ? "bg-card text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
            )}
            title={isCollapsed ? "Light Mode" : undefined}
          >
            <Sun className={cn("w-3.5 h-3.5", theme === "light" && "text-amber-500")} />
            {!isCollapsed && <span>Light</span>}
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-1.5 transition-all text-xs font-medium",
              theme === "dark" ? "bg-card text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
            )}
            title={isCollapsed ? "Dark Mode" : undefined}
          >
            <Moon className={cn("w-3.5 h-3.5", theme === "dark" && "text-sky-400")} />
            {!isCollapsed && <span>Dark</span>}
          </button>
        </div>

        {/* User Profile Area */}
        {user && (
          <div className={cn(
            "flex items-center gap-3 transition-all",
            isCollapsed && "justify-center flex-col"
          )}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-border/50 bg-background flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all shadow-sm">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}&backgroundColor=transparent`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate leading-tight text-foreground">{user.name}</p>
                  <p className="text-[10.5px] text-muted-foreground truncate leading-tight mt-0.5">{user.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="shrink-0 text-muted-foreground hover:text-foreground p-1.5 transition-colors outline-none bg-background/50 hover:bg-background border border-border/50 rounded-md" title="Account Menu">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-500/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
