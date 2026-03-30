import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PageName } from "../App";
import {
  useAllSubjects,
  useCalendarEvents,
  useNotifications,
  useStudentProfile,
} from "../hooks/useQueries";

interface Props {
  navigate: (page: PageName, subjectId?: bigint) => void;
}

function bigintToDate(t: bigint): Date {
  return new Date(Number(t / 1_000_000n));
}

export default function DashboardPage({ navigate }: Props) {
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const {
    data: subjects,
    isLoading: subjectsLoading,
    error: subjectsError,
    refetch: refetchSubjects,
  } = useAllSubjects();
  const { data: notifications } = useNotifications();
  const { data: events } = useCalendarEvents();

  const isLoading = profileLoading || subjectsLoading;

  const avgAttendance =
    subjects && subjects.length > 0
      ? Math.round(
          subjects.reduce((acc, s) => acc + Number(s.attendancePercent), 0) /
            subjects.length,
        )
      : 0;

  const upcomingExams =
    events?.filter((e) => {
      const d = bigintToDate(e.date);
      return e.eventType === "exam" && d >= new Date();
    }).length ?? 0;

  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;

  const stats = [
    {
      label: "Total Subjects",
      value: subjects?.length ?? 0,
      icon: BookOpen,
      color: "#22D3EE",
      bg: "rgba(34,211,238,0.12)",
    },
    {
      label: "Upcoming Exams",
      value: upcomingExams,
      icon: CalendarDays,
      color: "#EF4444",
      bg: "rgba(239,68,68,0.12)",
    },
    {
      label: "Avg Attendance",
      value: `${avgAttendance}%`,
      icon: TrendingUp,
      color: "#34D399",
      bg: "rgba(52,211,153,0.12)",
    },
    {
      label: "Notifications",
      value: unread,
      icon: Bell,
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.12)",
    },
  ];

  const pieData =
    subjects?.slice(0, 5).map((s) => ({
      name: s.name,
      value: Number(s.attendancePercent),
    })) ?? [];
  const PIE_COLORS = ["#22D3EE", "#34D399", "#8B5CF6", "#2B8FEA", "#EF4444"];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="glass-card p-6" data-ocid="dashboard.section">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
              color: "#071527",
            }}
          >
            {profile?.name
              ? profile.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "ST"}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold" style={{ color: "#F2F6FF" }}>
              Welcome back, {profile?.name || "Student"} 👋
            </h2>
            <p style={{ color: "#A9B7C8" }} className="text-sm">
              {profile?.course || "B.Sc"} · Year{" "}
              {profile?.year ? Number(profile.year) : 1} ·{" "}
              {profile?.studentId || "GCG2024001"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("subjects")}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            data-ocid="dashboard.subjects.button"
          >
            View Subjects <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="stat-card"
            data-ocid={`dashboard.${label.replace(/ /g, "_").toLowerCase()}.card`}
          >
            {isLoading ? (
              <Skeleton className="h-16 w-full rounded-lg" />
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg" style={{ background: bg }}>
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                </div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#F2F6FF" }}
                >
                  {value}
                </div>
                <div className="text-xs" style={{ color: "#A9B7C8" }}>
                  {label}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {subjectsError && (
        <div
          className="glass-card p-4 flex items-center justify-between"
          style={{ border: "1px solid rgba(239,68,68,0.30)" }}
          data-ocid="dashboard.error_state"
        >
          <div className="flex items-center gap-2" style={{ color: "#FCA5A5" }}>
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Failed to load subjects</span>
          </div>
          <button
            type="button"
            onClick={() => refetchSubjects()}
            className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg"
            style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5" }}
            data-ocid="dashboard.retry.button"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {/* Subjects + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject cards */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base font-semibold" style={{ color: "#F2F6FF" }}>
            Your Subjects
          </h3>
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => i).map((i) => (
                <Skeleton
                  key={`subj-sk-${i}`}
                  className="h-20 w-full rounded-xl"
                />
              ))
            : (subjects ?? []).slice(0, 4).map((s, i) => (
                <button
                  type="button"
                  key={String(s.id)}
                  className="glass-card p-4 w-full text-left cursor-pointer hover:border-cyan-400/30 transition-all"
                  onClick={() => navigate("subject-detail", s.id)}
                  data-ocid={`dashboard.subject.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div
                        className="font-semibold text-sm"
                        style={{ color: "#F2F6FF" }}
                      >
                        {s.name}
                      </div>
                      <div className="text-xs" style={{ color: "#A9B7C8" }}>
                        {s.professorName}
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background:
                          Number(s.attendancePercent) >= 75
                            ? "rgba(52,211,153,0.15)"
                            : "rgba(239,68,68,0.15)",
                        color:
                          Number(s.attendancePercent) >= 75
                            ? "#34D399"
                            : "#EF4444",
                      }}
                    >
                      {Number(s.attendancePercent)}%
                    </span>
                  </div>
                  <Progress
                    value={Number(s.attendancePercent)}
                    className="h-1.5"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                </button>
              ))}
          {!isLoading && (subjects ?? []).length === 0 && (
            <div
              className="glass-card p-8 text-center"
              data-ocid="dashboard.subjects.empty_state"
            >
              <BookOpen
                className="h-8 w-8 mx-auto mb-2"
                style={{ color: "#A9B7C8" }}
              />
              <p className="text-sm" style={{ color: "#A9B7C8" }}>
                No subjects yet. Sync with the portal.
              </p>
            </div>
          )}
        </div>

        {/* Attendance chart */}
        <div className="glass-card p-5">
          <h3
            className="text-base font-semibold mb-4"
            style={{ color: "#F2F6FF" }}
          >
            Attendance Overview
          </h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, cellIdx) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[cellIdx % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(7,21,39,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    formatter={(v: number) => [`${v}%`, "Attendance"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1">
                {pieData.map((d, idx) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: PIE_COLORS[idx % PIE_COLORS.length],
                      }}
                    />
                    <span className="truncate" style={{ color: "#A9B7C8" }}>
                      {d.name}
                    </span>
                    <span
                      className="ml-auto font-medium"
                      style={{ color: "#F2F6FF" }}
                    >
                      {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Skeleton className="h-48 w-full rounded-lg" />
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-5">
        <h3
          className="text-base font-semibold mb-4"
          style={{ color: "#F2F6FF" }}
        >
          Recent Notifications
        </h3>
        {(notifications ?? []).length === 0 ? (
          <p
            className="text-sm text-center py-4"
            style={{ color: "#A9B7C8" }}
            data-ocid="dashboard.notifications.empty_state"
          >
            No notifications
          </p>
        ) : (
          <div className="space-y-3">
            {(notifications ?? []).slice(0, 5).map((n, i) => (
              <div
                key={String(n.id)}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  background: n.isRead
                    ? "transparent"
                    : "rgba(34,211,238,0.06)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
                data-ocid={`dashboard.notification.item.${i + 1}`}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: n.isRead ? "#A9B7C8" : "#22D3EE" }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-sm"
                    style={{ color: "#F2F6FF" }}
                  >
                    {n.title}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#A9B7C8" }}>
                    {n.message}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#A9B7C8" }}>
                    {bigintToDate(n.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
