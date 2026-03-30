import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PageName } from "../App";
import { useAllSubjects, useUpdateSubject } from "../hooks/useQueries";

interface Props {
  navigate: (page: PageName, subjectId?: bigint) => void;
}

function bigintToDate(t: bigint): string {
  return new Date(Number(t / 1_000_000n)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SubjectsPage({ navigate }: Props) {
  const { data: subjects, isLoading, error, refetch } = useAllSubjects();
  const updateSubject = useUpdateSubject();
  const [search, setSearch] = useState("");

  const filtered = (subjects ?? []).filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.professorName.toLowerCase().includes(search.toLowerCase()),
  );

  async function markComplete(s: (typeof filtered)[0]) {
    try {
      await updateSubject.mutateAsync({ ...s, isCompleted: true });
      toast.success(`${s.name} marked as complete`);
    } catch {
      toast.error("Failed to update subject");
    }
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="glass-card p-3 flex items-center gap-3">
        <Search
          className="h-4 w-4 flex-shrink-0"
          style={{ color: "#A9B7C8" }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subjects or professors..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "#F2F6FF" }}
          data-ocid="subjects.search_input"
        />
      </div>

      {error && (
        <div
          className="glass-card p-4 flex items-center justify-between"
          style={{ border: "1px solid rgba(239,68,68,0.30)" }}
          data-ocid="subjects.error_state"
        >
          <div className="flex items-center gap-2" style={{ color: "#FCA5A5" }}>
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Failed to load subjects</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg"
            style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5" }}
            data-ocid="subjects.retry.button"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => `sk-${i}`).map((k) => (
              <div
                key={k}
                className="glass-card p-5 h-52 animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))
          : filtered.map((s, i) => (
              <div
                key={String(s.id)}
                className="glass-card p-5 flex flex-col gap-4"
                data-ocid={`subjects.item.${i + 1}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3
                      className="font-bold text-sm leading-tight"
                      style={{ color: "#F2F6FF" }}
                    >
                      {s.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "#A9B7C8" }}>
                      {s.professorName}
                    </p>
                  </div>
                  {s.isCompleted && (
                    <CheckCircle
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: "#34D399" }}
                    />
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className="rounded-lg p-2"
                    style={{ background: "rgba(239,68,68,0.10)" }}
                  >
                    <div style={{ color: "#A9B7C8" }}>Exam</div>
                    <div
                      className="font-medium mt-0.5"
                      style={{ color: "#FCA5A5" }}
                    >
                      {bigintToDate(s.examDate)}
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-2"
                    style={{ background: "rgba(139,92,246,0.10)" }}
                  >
                    <div style={{ color: "#A9B7C8" }}>Practical</div>
                    <div
                      className="font-medium mt-0.5"
                      style={{ color: "#C4B5FD" }}
                    >
                      {bigintToDate(s.practicalDate)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#A9B7C8" }}>Attendance</span>
                    <span
                      className="font-semibold"
                      style={{
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
                  />
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#A9B7C8" }}>Marks</span>
                    <span
                      className="font-semibold"
                      style={{ color: "#22D3EE" }}
                    >
                      {Number(s.marksObtained)}/{Number(s.maxMarks)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => navigate("subject-detail", s.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-all hover:bg-cyan-400/10"
                    style={{
                      border: "1px solid rgba(34,211,238,0.30)",
                      color: "#22D3EE",
                    }}
                    data-ocid={`subjects.view_detail.button.${i + 1}`}
                  >
                    View Details <ChevronRight className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => markComplete(s)}
                    disabled={s.isCompleted || updateSubject.isPending}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-all disabled:opacity-50"
                    style={{
                      background: s.isCompleted
                        ? "rgba(52,211,153,0.15)"
                        : "rgba(52,211,153,0.12)",
                      color: "#34D399",
                      border: "1px solid rgba(52,211,153,0.25)",
                    }}
                    data-ocid={`subjects.complete.button.${i + 1}`}
                  >
                    {updateSubject.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle className="h-3 w-3" />
                    )}
                    {s.isCompleted ? "Done" : "Complete"}
                  </button>
                </div>
              </div>
            ))}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div
          className="glass-card p-12 text-center"
          data-ocid="subjects.empty_state"
        >
          <BookOpen
            className="h-10 w-10 mx-auto mb-3"
            style={{ color: "#A9B7C8" }}
          />
          <p style={{ color: "#A9B7C8" }}>No subjects found</p>
        </div>
      )}
    </div>
  );
}
