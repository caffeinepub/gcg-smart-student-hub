import { Bell, Menu } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useNotifications, useStudentProfile } from "../hooks/useQueries";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { identity } = useInternetIdentity();
  const { data: profile } = useStudentProfile();
  const { data: notifications } = useNotifications();

  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;
  const displayName =
    profile?.name || `${identity?.getPrincipal().toString().slice(0, 8)}...`;
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-4"
      style={{
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "rgba(7,21,39,0.70)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
          style={{ color: "#A9B7C8" }}
          data-ocid="header.menu.button"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold" style={{ color: "#F2F6FF" }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: "#A9B7C8" }}
          data-ocid="header.notifications.button"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: "#EF4444", color: "#fff" }}
              data-ocid="header.notifications.badge"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
              color: "#071527",
            }}
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium" style={{ color: "#F2F6FF" }}>
              {displayName}
            </div>
            {profile?.studentId && (
              <div className="text-xs" style={{ color: "#A9B7C8" }}>
                {profile.studentId}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
