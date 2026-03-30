import { Edit2, Loader2, Save, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { StudentProfile } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile, useStudentProfile } from "../hooks/useQueries";

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useStudentProfile();
  const saveProfile = useSaveProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<StudentProfile>({
    studentId: "",
    name: "",
    course: "",
    year: 1n,
    email: "",
    phone: "",
    profileImage: "",
  });

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  async function handleSave() {
    try {
      await saveProfile.mutateAsync(form);
      setEditing(false);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
  }

  function handleChange(key: keyof StudentProfile, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: key === "year" ? BigInt(value || "1") : value,
    }));
  }

  const initials = form.name
    ? form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => `sk-${i}`).map((k) => (
          <div
            key={k}
            className="glass-card p-5 h-20 animate-pulse"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Avatar */}
      <div className="glass-card p-6 flex items-center gap-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
            color: "#071527",
            boxShadow: "0 8px 24px rgba(34,211,238,0.30)",
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold" style={{ color: "#F2F6FF" }}>
            {form.name || "Student Name"}
          </h2>
          <p className="text-sm" style={{ color: "#A9B7C8" }}>
            {form.course || "Course"} · Year {Number(form.year)}
          </p>
          <p className="text-xs mt-1" style={{ color: "#22D3EE" }}>
            {form.studentId ||
              `${identity?.getPrincipal().toString().slice(0, 12)}...`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: editing ? "#22D3EE" : "#A9B7C8" }}
          data-ocid="profile.edit.button"
        >
          {editing ? <X className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
        </button>
      </div>

      {/* Fields */}
      <div className="glass-card p-6 space-y-5">
        <h3 className="font-semibold text-sm" style={{ color: "#F2F6FF" }}>
          Student Information
        </h3>

        {(
          [
            { key: "name", label: "Full Name", type: "text" },
            { key: "studentId", label: "Student ID", type: "text" },
            { key: "course", label: "Course", type: "text" },
            { key: "year", label: "Year", type: "number" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Phone", type: "tel" },
          ] as { key: keyof StudentProfile; label: string; type: string }[]
        ).map(({ key, label, type }) => (
          <div key={key}>
            <label
              htmlFor={`profile-field-${key}`}
              className="block text-xs font-medium mb-1.5"
              style={{ color: "#A9B7C8" }}
            >
              {label}
            </label>
            {editing ? (
              <input
                id={`profile-field-${key}`}
                type={type}
                value={
                  key === "year" ? Number(form[key]) : String(form[key] || "")
                }
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(34,211,238,0.30)",
                  color: "#F2F6FF",
                }}
                data-ocid={`profile.${key}.input`}
              />
            ) : (
              <div
                className="px-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#F2F6FF",
                }}
              >
                {key === "year" ? Number(form[key]) : String(form[key] || "—")}
              </div>
            )}
          </div>
        ))}

        {editing && (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveProfile.isPending}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold"
              data-ocid="profile.save.button"
            >
              {saveProfile.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                if (profile) setForm(profile);
              }}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#A9B7C8",
              }}
              data-ocid="profile.cancel.button"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Principal */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3">
          <User
            className="h-4 w-4 flex-shrink-0"
            style={{ color: "#22D3EE" }}
          />
          <div className="min-w-0">
            <div className="text-xs font-medium" style={{ color: "#A9B7C8" }}>
              Internet Identity Principal
            </div>
            <div
              className="text-xs font-mono break-all mt-0.5"
              style={{ color: "#F2F6FF" }}
            >
              {identity?.getPrincipal().toString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
