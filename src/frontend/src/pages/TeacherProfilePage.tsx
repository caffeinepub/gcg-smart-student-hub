import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  Clock,
  Download,
  Eye,
  FileText,
  Mail,
  Megaphone,
  Phone,
  Send,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { PageName } from "../App";
import { TEACHERS } from "../data/teachers";

interface TeacherProfilePageProps {
  teacherId: number | null;
  navigate: (page: PageName) => void;
}

type TabName = "overview" | "notes" | "chat" | "performance";

const TABS: { id: TabName; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "notes", label: "Notes" },
  { id: "chat", label: "Chat" },
  { id: "performance", label: "Performance" },
];

interface ChatMessage {
  id: number;
  text: string;
  sender: "student" | "teacher";
  time: string;
}

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    text: "Good morning! I had a question about the last lecture.",
    sender: "student",
    time: "9:10 AM",
  },
  {
    id: 2,
    text: "Good morning! Sure, go ahead and ask.",
    sender: "teacher",
    time: "9:12 AM",
  },
  {
    id: 3,
    text: "Can you please share the notes for Unit 3?",
    sender: "student",
    time: "9:13 AM",
  },
  {
    id: 4,
    text: "I'll upload them to the portal shortly. Please check the Notes tab.",
    sender: "teacher",
    time: "9:15 AM",
  },
  {
    id: 5,
    text: "Thank you so much! Also, when is the next assignment due?",
    sender: "student",
    time: "9:16 AM",
  },
];

const NOTIFICATIONS = [
  {
    key: "assign",
    Icon: BookOpen,
    color: "#22D3EE",
    bg: "rgba(34,211,238,0.15)",
    title: "New Assignment Posted",
    time: "2 hours ago",
  },
  {
    key: "exam",
    Icon: AlertTriangle,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.15)",
    title: "Exam Alert",
    time: "1 day ago",
  },
  {
    key: "announce",
    Icon: Megaphone,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.15)",
    title: "Announcement",
    time: "2 days ago",
  },
];

const NOTE_FILES = [
  {
    key: "pdf",
    name: "Unit 1 Notes.pdf",
    size: "2.4 MB",
    iconColor: "#EF4444",
    bg: "rgba(239,68,68,0.15)",
  },
  {
    key: "docx",
    name: "Assignment 2.docx",
    size: "0.8 MB",
    iconColor: "#3B82F6",
    bg: "rgba(59,130,246,0.15)",
  },
];

const ASSIGNMENTS = [
  {
    key: "a1",
    label: "Assignment 1 \u2013 Unit 1",
    status: "Submitted",
    color: "#10B981",
    percent: 100,
  },
  {
    key: "a2",
    label: "Assignment 2 \u2013 Unit 2",
    status: "Pending",
    color: "#F59E0B",
    percent: 60,
  },
  {
    key: "a3",
    label: "Assignment 3 \u2013 Unit 3",
    status: "Late",
    color: "#EF4444",
    percent: 30,
  },
];

function CircleProgress({
  percent,
  label,
}: { percent: number; label: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg
          className="w-24 h-24 -rotate-90"
          viewBox="0 0 96 96"
          role="img"
          aria-label={`${label}: ${percent}%`}
        >
          <circle
            cx="48"
            cy="48"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r={r}
            fill="none"
            stroke="url(#circGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          <defs>
            <linearGradient id="circGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2B8FEA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: "#F2F6FF" }}>
            {percent}%
          </span>
        </div>
      </div>
      <span className="text-sm" style={{ color: "#A9B7C8" }}>
        {label}
      </span>
    </div>
  );
}

export default function TeacherProfilePage({
  teacherId,
  navigate,
}: TeacherProfilePageProps) {
  const teacher = TEACHERS.find((t) => t.id === teacherId) ?? TEACHERS[0];
  const [activeTab, setActiveTab] = useState<TabName>("overview");
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [newMsg, setNewMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }

  function sendMessage() {
    const text = newMsg.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, text, sender: "student", time: now },
    ]);
    setNewMsg("");
    scrollToBottom();
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Thank you for your message! I'll get back to you soon.",
          sender: "teacher",
          time: replyTime,
        },
      ]);
      scrollToBottom();
    }, 1200);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-0">
      {/* Gradient Header */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2B8FEA 0%, #7C3AED 100%)",
          minHeight: 160,
        }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
          style={{
            background: "rgba(255,255,255,0.3)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
          style={{
            background: "rgba(255,255,255,0.4)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <button
          type="button"
          onClick={() => navigate("teachers")}
          className="absolute top-4 left-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors text-sm font-medium"
          data-ocid="teacher_profile.back.button"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col items-center pt-10 pb-8 px-4 text-center relative z-10">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3"
            style={{
              background: teacher.avatarColor,
              border: "4px solid rgba(255,255,255,0.5)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {teacher.initials}
          </div>
          <h2 className="text-xl font-bold text-white">{teacher.name}</h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
            <span
              className="px-3 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
            >
              {teacher.role}
            </span>
            <Badge
              className="text-xs"
              style={{
                background: "rgba(34,211,238,0.3)",
                color: "#fff",
                border: "1px solid rgba(34,211,238,0.5)",
              }}
            >
              {teacher.subject}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mt-4 p-1 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        data-ocid="teacher_profile.tabs.panel"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background:
                activeTab === tab.id
                  ? "linear-gradient(135deg, #2B8FEA, #7C3AED)"
                  : "transparent",
              color: activeTab === tab.id ? "#fff" : "#A9B7C8",
            }}
            data-ocid={`teacher_profile.${tab.id}.tab`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4 space-y-4"
        >
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={`tel:${teacher.phone.replace(/\s/g, "")}`}
                  className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(43,143,234,0.2)" }}
                  >
                    <Phone className="h-5 w-5" style={{ color: "#22D3EE" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs" style={{ color: "#A9B7C8" }}>
                      Phone
                    </p>
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "#F2F6FF" }}
                    >
                      {teacher.phone}
                    </p>
                  </div>
                </a>
                <a
                  href={`mailto:${teacher.email}`}
                  className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(124,58,237,0.2)" }}
                  >
                    <Mail className="h-5 w-5" style={{ color: "#A78BFA" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs" style={{ color: "#A9B7C8" }}>
                      Email
                    </p>
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "#F2F6FF" }}
                    >
                      {teacher.email}
                    </p>
                  </div>
                </a>
                <div className="glass-card p-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.2)" }}
                  >
                    <Clock className="h-5 w-5" style={{ color: "#10B981" }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "#A9B7C8" }}>
                      Experience
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#F2F6FF" }}
                    >
                      {teacher.experience} Years
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="glass-card p-8 flex flex-col items-center justify-center gap-3 text-center"
                style={{ minHeight: 140 }}
                data-ocid="teacher_profile.video.panel"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #2B8FEA, #7C3AED)",
                  }}
                >
                  <Video className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold" style={{ color: "#F2F6FF" }}>
                  Introduction Video
                </p>
                <p className="text-sm" style={{ color: "#A9B7C8" }}>
                  Coming Soon
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "#A9B7C8" }}
                >
                  Recent Notifications
                </h3>
                {NOTIFICATIONS.map((notif, idx) => (
                  <div
                    key={notif.key}
                    className="glass-card p-4 flex items-start gap-3"
                    data-ocid={`teacher_profile.notification.item.${idx + 1}`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: notif.bg }}
                    >
                      <notif.Icon
                        className="h-4 w-4"
                        style={{ color: notif.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#F2F6FF" }}
                      >
                        {notif.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#A9B7C8" }}
                      >
                        {teacher.subject} update
                      </p>
                    </div>
                    <span
                      className="text-xs flex-shrink-0"
                      style={{ color: "#A9B7C8" }}
                    >
                      {notif.time}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NOTES */}
          {activeTab === "notes" && (
            <div className="space-y-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: "#A9B7C8" }}
              >
                Shared Materials
              </h3>
              {NOTE_FILES.map((file, idx) => (
                <div
                  key={file.key}
                  className="glass-card p-4 flex items-center gap-4"
                  data-ocid={`teacher_profile.notes.item.${idx + 1}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: file.bg }}
                  >
                    <FileText
                      className="h-6 w-6"
                      style={{ color: file.iconColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "#F2F6FF" }}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs" style={{ color: "#A9B7C8" }}>
                      {file.size}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        border: "1px solid rgba(43,143,234,0.4)",
                        color: "#22D3EE",
                        background: "transparent",
                      }}
                      data-ocid={`teacher_profile.notes.view.button.${idx + 1}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #2B8FEA, #7C3AED)",
                      }}
                      data-ocid={`teacher_profile.notes.download.button.${idx + 1}`}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CHAT */}
          {activeTab === "chat" && (
            <div
              className="glass-card flex flex-col"
              style={{ height: 420 }}
              data-ocid="teacher_profile.chat.panel"
            >
              <div
                className="px-4 py-3 border-b flex items-center gap-3"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: teacher.avatarColor }}
                >
                  {teacher.initials}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#F2F6FF" }}
                  >
                    {teacher.name}
                  </p>
                  <p className="text-xs" style={{ color: "#10B981" }}>
                    ● Online
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1 px-4 py-3">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "student" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className="max-w-xs px-4 py-2 rounded-2xl text-sm"
                        style={{
                          background:
                            msg.sender === "teacher"
                              ? "linear-gradient(135deg, #2B8FEA, #7C3AED)"
                              : "rgba(255,255,255,0.08)",
                          color: msg.sender === "teacher" ? "#fff" : "#F2F6FF",
                          borderBottomRightRadius:
                            msg.sender === "teacher" ? 4 : 16,
                          borderBottomLeftRadius:
                            msg.sender === "student" ? 4 : 16,
                        }}
                      >
                        <p>{msg.text}</p>
                        <p
                          className="text-xs mt-1 text-right"
                          style={{
                            color:
                              msg.sender === "teacher"
                                ? "rgba(255,255,255,0.7)"
                                : "#A9B7C8",
                          }}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              <div
                className="px-4 py-3 border-t flex gap-2"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <Input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F2F6FF",
                  }}
                  data-ocid="teacher_profile.chat.input"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #2B8FEA, #7C3AED)",
                  }}
                  data-ocid="teacher_profile.chat.submit_button"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* PERFORMANCE */}
          {activeTab === "performance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 flex flex-col items-center gap-2">
                  <CircleProgress percent={85} label="Attendance" />
                </div>
                <div className="glass-card p-6 flex flex-col gap-3">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#A9B7C8" }}
                  >
                    Marks
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#F2F6FF" }}
                  >
                    78
                    <span
                      className="text-sm font-normal"
                      style={{ color: "#A9B7C8" }}
                    >
                      /100
                    </span>
                  </p>
                  <div
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "78%",
                        background: "linear-gradient(90deg, #2B8FEA, #7C3AED)",
                      }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: "#A9B7C8" }}>
                    Good Performance
                  </p>
                </div>
              </div>

              <div className="glass-card p-5 space-y-4">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "#F2F6FF" }}
                >
                  Assignment Progress
                </h3>
                {ASSIGNMENTS.map((a, idx) => (
                  <div
                    key={a.key}
                    className="space-y-1.5"
                    data-ocid={`teacher_profile.assignment.item.${idx + 1}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "#F2F6FF" }}>
                        {a.label}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: `${a.color}22`,
                          color: a.color,
                          border: `1px solid ${a.color}44`,
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${a.percent}%`,
                          background: `linear-gradient(90deg, ${a.color}, ${a.color}88)`,
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
