import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Info,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Phone,
  User,
  X,
} from "lucide-react";
import type { PageName } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface SidebarProps {
  currentPage: PageName;
  navigate: (page: PageName) => void;
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS: {
  label: string;
  page: PageName;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { label: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { label: "Subjects", page: "subjects", icon: BookOpen },
  { label: "Teachers", page: "teachers", icon: GraduationCap },
  { label: "Calendar", page: "calendar", icon: CalendarDays },
  { label: "Chat", page: "chat", icon: MessageSquare },
  { label: "Profile", page: "profile", icon: User },
  { label: "Contact", page: "contact", icon: Phone },
  { label: "About", page: "about", icon: Info },
];

export default function Sidebar({
  currentPage,
  navigate,
  open,
  onClose,
}: SidebarProps) {
  const { clear } = useInternetIdentity();

  return (
    <aside
      className={`glass-sidebar fixed top-0 left-0 h-screen w-60 z-30 flex flex-col transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
      data-ocid="sidebar.panel"
    >
      {/* Close button mobile */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
        aria-label="Close sidebar"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Logo */}
      <div
        className="p-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
              color: "#071527",
              boxShadow: "0 4px 15px rgba(34,211,238,0.30)",
            }}
          >
            GC
          </div>
          <div className="min-w-0">
            <div
              className="text-xs font-bold leading-tight"
              style={{ color: "#F2F6FF" }}
            >
              Govt. College
            </div>
            <div className="text-xs" style={{ color: "#22D3EE" }}>
              Gangapur City
            </div>
          </div>
        </div>
        <div
          className="mt-3 text-center py-1 px-2 rounded text-xs font-semibold tracking-wider uppercase"
          style={{
            background: "rgba(34,211,238,0.10)",
            color: "#22D3EE",
            border: "1px solid rgba(34,211,238,0.20)",
          }}
        >
          Smart Student Portal
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, page, icon: Icon }) => {
          const isActive =
            currentPage === page ||
            (currentPage === "subject-detail" && page === "subjects") ||
            (currentPage === "teacher-profile" && page === "teachers");
          return (
            <button
              type="button"
              key={page}
              onClick={() => navigate(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                isActive ? "nav-item-active" : "hover:bg-white/5 hover:pl-4"
              }`}
              style={{ color: isActive ? "#22D3EE" : "#A9B7C8" }}
              data-ocid={`sidebar.${page}.link`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="p-3 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <button
          type="button"
          onClick={() => clear()}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all hover:bg-red-500/10"
          style={{ color: "#A9B7C8" }}
          data-ocid="sidebar.logout.button"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
