import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { PageName } from "../App";
import { SUBJECTS, TEACHERS } from "../data/teachers";

interface TeachersPageProps {
  navigate: (page: PageName) => void;
  onSelectTeacher: (id: number) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const partial = !filled && rating >= star - 0.5;
        return (
          <span
            key={star}
            className="text-sm"
            style={{ color: filled || partial ? "#F59E0B" : "#374151" }}
          >
            ★
          </span>
        );
      })}
      <span className="text-xs ml-1" style={{ color: "#A9B7C8" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function TeachersPage({ onSelectTeacher }: TeachersPageProps) {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");

  const filtered = useMemo(() => {
    return TEACHERS.filter((t) => {
      const matchName = t.name.toLowerCase().includes(search.toLowerCase());
      const matchSubject = subject === "all" || t.subject === subject;
      return matchName && matchSubject;
    });
  }, [search, subject]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2B8FEA 0%, #7C3AED 100%)",
          boxShadow: "0 8px 32px rgba(124, 58, 237, 0.3)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)",
          }}
        />
        <h1 className="text-3xl font-bold text-white relative z-10">
          Our Faculty
        </h1>
        <p className="text-blue-100 mt-1 relative z-10">
          Government College Gangapur City
        </p>
        <div
          className="mt-3 inline-block px-4 py-1 rounded-full text-sm font-semibold relative z-10"
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
        >
          {TEACHERS.length} Expert Educators
        </div>
      </motion.div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "#A9B7C8" }}
          />
          <Input
            placeholder="Search teacher by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F2F6FF",
            }}
            data-ocid="teachers.search_input"
          />
        </div>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger
            className="w-full sm:w-52"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F2F6FF",
            }}
            data-ocid="teachers.subject.select"
          >
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "#0f2744",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Count */}
      <p className="text-sm" style={{ color: "#A9B7C8" }}>
        Showing{" "}
        <span style={{ color: "#22D3EE" }} className="font-semibold">
          {filtered.length}
        </span>{" "}
        of {TEACHERS.length} teachers
      </p>

      {/* Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
        data-ocid="teachers.list"
      >
        {filtered.map((teacher, index) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
            className="glass-card p-5 flex flex-col items-center text-center gap-3 cursor-pointer group"
            style={{
              borderRadius: "18px",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => onSelectTeacher(teacher.id)}
            data-ocid={`teachers.item.${index + 1}`}
          >
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
              style={{
                background: teacher.avatarColor,
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                border: "3px solid rgba(255,255,255,0.15)",
              }}
            >
              {teacher.initials}
            </div>

            {/* Name */}
            <div>
              <p
                className="font-bold text-sm leading-tight"
                style={{ color: "#F2F6FF" }}
              >
                {teacher.name}
              </p>
            </div>

            {/* Subject badge */}
            <Badge
              className="text-xs px-2 py-0.5"
              style={{
                background: "rgba(43, 143, 234, 0.2)",
                color: "#22D3EE",
                border: "1px solid rgba(43, 143, 234, 0.3)",
              }}
            >
              {teacher.subject}
            </Badge>

            {/* Rating */}
            <StarRating rating={teacher.rating} />

            {/* Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTeacher(teacher.id);
              }}
              className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #2B8FEA, #7C3AED)",
                boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
              }}
              data-ocid={`teachers.view_profile.button.${index + 1}`}
            >
              View Profile
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="glass-card p-12 text-center"
          data-ocid="teachers.empty_state"
        >
          <p className="text-2xl mb-2">🔍</p>
          <p style={{ color: "#A9B7C8" }}>No teachers match your search.</p>
        </div>
      )}
    </div>
  );
}
