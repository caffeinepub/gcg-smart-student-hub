import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AboutPage from "./pages/AboutPage";
import CalendarPage from "./pages/CalendarPage";
import ChatPage from "./pages/ChatPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import SubjectsPage from "./pages/SubjectsPage";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import TeachersPage from "./pages/TeachersPage";

export type PageName =
  | "dashboard"
  | "subjects"
  | "subject-detail"
  | "calendar"
  | "chat"
  | "profile"
  | "contact"
  | "about"
  | "teachers"
  | "teacher-profile";

const PAGE_TITLES: Record<PageName, string> = {
  dashboard: "Dashboard",
  subjects: "Subjects",
  "subject-detail": "Subject Details",
  calendar: "Calendar",
  chat: "Student Chat",
  profile: "My Profile",
  contact: "Contact",
  about: "About",
  teachers: "Teachers",
  "teacher-profile": "Teacher Profile",
};

// Apply dark class to html element
if (typeof document !== "undefined") {
  document.documentElement.classList.add("dark");
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const [currentPage, setCurrentPage] = useState<PageName>("dashboard");
  const [selectedSubjectId, setSelectedSubjectId] = useState<bigint | null>(
    null,
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const seededRef = useRef(false);

  useEffect(() => {
    if (actor && identity && !seededRef.current) {
      seededRef.current = true;
      actor.seedDemoData().catch(() => {});
    }
  }, [actor, identity]);

  function navigate(page: PageName, subjectId?: bigint) {
    setCurrentPage(page);
    if (subjectId !== undefined) setSelectedSubjectId(subjectId);
    setSidebarOpen(false);
  }

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="glass-card p-10 flex flex-col items-center gap-4">
          <div className="text-4xl font-bold gradient-text">GC</div>
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm" style={{ color: "#A9B7C8" }}>
            Loading Smart Student Hub...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  function renderPage() {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage navigate={navigate} />;
      case "subjects":
        return <SubjectsPage navigate={navigate} />;
      case "subject-detail":
        return (
          <SubjectDetailPage
            subjectId={selectedSubjectId}
            navigate={navigate}
          />
        );
      case "calendar":
        return <CalendarPage />;
      case "chat":
        return <ChatPage />;
      case "profile":
        return <ProfilePage />;
      case "contact":
        return <ContactPage />;
      case "about":
        return <AboutPage />;
      case "teachers":
        return (
          <TeachersPage
            navigate={navigate}
            onSelectTeacher={(id) => {
              setSelectedTeacherId(id);
              navigate("teacher-profile");
            }}
          />
        );
      case "teacher-profile":
        return (
          <TeacherProfilePage
            teacherId={selectedTeacherId}
            navigate={navigate}
          />
        );
      default:
        return <DashboardPage navigate={navigate} />;
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-20 md:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col md:ml-60">
        <Header
          title={PAGE_TITLES[currentPage]}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{renderPage()}</main>
        <footer
          className="py-3 text-center text-xs"
          style={{ color: "#A9B7C8" }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
