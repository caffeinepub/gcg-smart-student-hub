import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { PageName } from "../App";
import {
  useAllAssignments,
  useAllSubjects,
  usePerformanceData,
  useSubmitAssignment,
} from "../hooks/useQueries";

interface Props {
  subjectId: bigint | null;
  navigate: (page: PageName) => void;
}

function bigintToDate(t: bigint): string {
  return new Date(Number(t / 1_000_000n)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function SubjectDetailPage({ subjectId, navigate }: Props) {
  const { data: subjects } = useAllSubjects();
  const { data: assignments } = useAllAssignments();
  const { data: perfData } = usePerformanceData();
  const submitAssignment = useSubmitAssignment();

  const subject = subjects?.find((s) => s.id === subjectId);
  const subjectAssignments =
    assignments?.filter((a) => a.subjectId === subjectId) ?? [];
  const subjectPerf = perfData?.filter((p) => p.subjectId === subjectId) ?? [];

  const chartData = subjectPerf.map((p) => ({
    month: MONTH_NAMES[Number(p.month) - 1] ?? `M${p.month}`,
    marks: Number(p.marksPercent),
    attendance: Number(p.attendancePercent),
  }));

  const pieData = subject
    ? [
        { name: "Present", value: Number(subject.attendancePercent) },
        { name: "Absent", value: 100 - Number(subject.attendancePercent) },
      ]
    : [];

  async function handleSubmit(id: bigint) {
    try {
      await submitAssignment.mutateAsync(id);
      toast.success("Assignment submitted!");
    } catch {
      toast.error("Failed to submit assignment");
    }
  }

  if (!subject) {
    return (
      <div className="glass-card p-12 text-center">
        <BookOpen
          className="h-10 w-10 mx-auto mb-3"
          style={{ color: "#A9B7C8" }}
        />
        <p style={{ color: "#A9B7C8" }}>Subject not found</p>
        <button
          type="button"
          onClick={() => navigate("subjects")}
          className="mt-4 btn-primary px-4 py-2 text-sm"
          data-ocid="subject_detail.back.button"
        >
          Back to Subjects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <button
        type="button"
        onClick={() => navigate("subjects")}
        className="flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors"
        style={{ color: "#A9B7C8" }}
        data-ocid="subject_detail.back.button"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Subjects
      </button>

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #22D3EE22, #2B8FEA22)",
              border: "1px solid rgba(34,211,238,0.30)",
            }}
          >
            <BarChart2 className="h-6 w-6" style={{ color: "#22D3EE" }} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: "#F2F6FF" }}>
              {subject.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: "#A9B7C8" }}>
              Prof. {subject.professorName}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs">
              <span
                className="px-2 py-1 rounded-lg"
                style={{ background: "rgba(239,68,68,0.12)", color: "#FCA5A5" }}
              >
                Exam: {bigintToDate(subject.examDate)}
              </span>
              <span
                className="px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(139,92,246,0.12)",
                  color: "#C4B5FD",
                }}
              >
                Practical: {bigintToDate(subject.practicalDate)}
              </span>
              <span
                className="px-2 py-1 rounded-lg"
                style={{
                  background:
                    Number(subject.attendancePercent) >= 75
                      ? "rgba(52,211,153,0.12)"
                      : "rgba(239,68,68,0.12)",
                  color:
                    Number(subject.attendancePercent) >= 75
                      ? "#34D399"
                      : "#EF4444",
                }}
              >
                Attendance: {Number(subject.attendancePercent)}%
              </span>
              <span
                className="px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(34,211,238,0.12)",
                  color: "#22D3EE",
                }}
              >
                Marks: {Number(subject.marksObtained)}/
                {Number(subject.maxMarks)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "#F2F6FF" }}
          >
            Performance by Month
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#A9B7C8", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#A9B7C8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(7,21,39,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="marks" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="attendance"
                  fill="#34D399"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="h-48 flex items-center justify-center"
              style={{ color: "#A9B7C8" }}
            >
              No performance data
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "#F2F6FF" }}
          >
            Attendance Analytics
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  dataKey="value"
                >
                  <Cell fill="#22D3EE" />
                  <Cell fill="rgba(255,255,255,0.1)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: "#22D3EE" }}
                >
                  {Number(subject.attendancePercent)}%
                </div>
                <div className="text-xs" style={{ color: "#A9B7C8" }}>
                  Attendance Rate
                </div>
              </div>
              <Progress
                value={Number(subject.attendancePercent)}
                className="h-2"
              />
              <div
                className="text-xs px-2 py-1 rounded inline-block"
                style={{
                  background:
                    Number(subject.attendancePercent) >= 75
                      ? "rgba(52,211,153,0.15)"
                      : "rgba(239,68,68,0.15)",
                  color:
                    Number(subject.attendancePercent) >= 75
                      ? "#34D399"
                      : "#EF4444",
                }}
              >
                {Number(subject.attendancePercent) >= 75
                  ? "✓ Eligible"
                  : "⚠ Below 75%"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#F2F6FF" }}>
          Assignments
        </h3>
        {subjectAssignments.length === 0 ? (
          <p
            className="text-sm text-center py-6"
            style={{ color: "#A9B7C8" }}
            data-ocid="subject_detail.assignments.empty_state"
          >
            No assignments for this subject
          </p>
        ) : (
          <div className="space-y-3">
            {subjectAssignments.map((a, i) => (
              <div
                key={String(a.id)}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                data-ocid={`subject_detail.assignment.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-sm"
                    style={{ color: "#F2F6FF" }}
                  >
                    {a.title}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#A9B7C8" }}>
                    {a.description}
                  </div>
                  <div
                    className="flex items-center gap-1 mt-1 text-xs"
                    style={{ color: a.isSubmitted ? "#34D399" : "#FCA5A5" }}
                  >
                    {a.isSubmitted ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {a.isSubmitted
                      ? "Submitted"
                      : `Due: ${bigintToDate(a.dueDate)}`}
                  </div>
                </div>
                {!a.isSubmitted && (
                  <button
                    type="button"
                    onClick={() => handleSubmit(a.id)}
                    disabled={submitAssignment.isPending}
                    className="ml-3 px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1"
                    style={{
                      background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
                      color: "#071527",
                    }}
                    data-ocid={`subject_detail.submit.button.${i + 1}`}
                  >
                    {submitAssignment.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : null}
                    Submit
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
