export interface Teacher {
  id: number;
  name: string;
  subject: string;
  prefix: string;
  role: string;
  rating: number;
  experience: number;
  phone: string;
  email: string;
  avatarColor: string;
  initials: string;
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #2B8FEA, #7C3AED)",
  "linear-gradient(135deg, #7C3AED, #EC4899)",
  "linear-gradient(135deg, #22D3EE, #2B8FEA)",
  "linear-gradient(135deg, #10B981, #22D3EE)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #8B5CF6, #2B8FEA)",
];

function getInitials(name: string, prefix: string): string {
  const withoutPrefix = name.replace(prefix, "").trim();
  const parts = withoutPrefix.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getEmail(name: string, prefix: string): string {
  const withoutPrefix = name.replace(prefix, "").trim();
  const parts = withoutPrefix
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .split(" ")
    .filter(Boolean);
  if (parts.length === 0) return "teacher@gcgc.edu.in";
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first}.${last}@gcgc.edu.in`;
}

function getPhone(id: number): string {
  const digits = String(id * 7 + 9800000000).slice(-10);
  return `+91 ${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

const RAW: { name: string; subject: string; prefix: string }[] = [
  { prefix: "Dr.", name: "Dr. Sumitra Meena", subject: "Principal" },
  { prefix: "Sh.", name: "Sh. Chandra Shekhar Meena", subject: "Chemistry" },
  { prefix: "Sh.", name: "Sh. Rakesh Kumar Dubey", subject: "Chemistry" },
  { prefix: "Smt.", name: "Smt. Urmila Meena", subject: "Chemistry" },
  { prefix: "Sh.", name: "Sh. Vijendra Kumar Meena", subject: "Chemistry" },
  { prefix: "Sh.", name: "Sh. Pradhan Singh Meena", subject: "Mathematics" },
  { prefix: "Sh.", name: "Sh. Mahendra Kumar Meena", subject: "Botany" },
  { prefix: "Dr.", name: "Dr. Sunil Kumar Meena", subject: "Zoology" },
  { prefix: "Smt.", name: "Smt. Shalu Kanwat", subject: "Zoology" },
  {
    prefix: "Sh.",
    name: "Sh. Kallan Singh Meena",
    subject: "Political Science",
  },
  { prefix: "Sh.", name: "Sh. Dharmveer Meena", subject: "Political Science" },
  {
    prefix: "Dr.",
    name: "Dr. Rohit Kumar Meena",
    subject: "Political Science",
  },
  {
    prefix: "Dr.",
    name: "Dr. Satish Kumar Meena",
    subject: "Political Science",
  },
  {
    prefix: "Sh.",
    name: "Sh. Mahendra Kumar Sharma",
    subject: "Political Science",
  },
  { prefix: "Sh.", name: "Sh. Gangaram Meena", subject: "Hindi Literature" },
  {
    prefix: "Sh.",
    name: "Sh. Dinesh Kumar Meena",
    subject: "Hindi Literature",
  },
  {
    prefix: "Dr.",
    name: "Dr. Arvind Kumar Dixit",
    subject: "Hindi Literature",
  },
  {
    prefix: "Dr.",
    name: "Dr. Ashok Kumar Sharma",
    subject: "Hindi Literature",
  },
  { prefix: "Sh.", name: "Sh. Dharmraj Meena", subject: "History" },
  { prefix: "Dr.", name: "Dr. Pinky Meena", subject: "History" },
  { prefix: "Sh.", name: "Sh. Ramkesh Meena", subject: "Sanskrit" },
  { prefix: "Sh.", name: "Sh. Suresh Chand Meena", subject: "Sanskrit" },
  { prefix: "Dr.", name: "Dr. Gunjan Garg", subject: "Sanskrit" },
  { prefix: "Dr.", name: "Dr. Mahendra Kumar Meena", subject: "Sanskrit" },
  { prefix: "Miss", name: "Miss Abha Agarwal", subject: "Economics" },
  { prefix: "Sh.", name: "Sh. Kailash Bairwa", subject: "Sociology" },
  { prefix: "Miss", name: "Miss Pinky Meena", subject: "English Literature" },
  {
    prefix: "Smt.",
    name: "Smt. Premlata Meena",
    subject: "English Literature",
  },
  { prefix: "Sh.", name: "Sh. Ramnaresh Meena", subject: "Physics" },
  { prefix: "Sh.", name: "Sh. Chetan Prakash Meena", subject: "Physics" },
  { prefix: "Sh.", name: "Sh. Tejram Meena", subject: "ABST" },
  { prefix: "Sh.", name: "Sh. Mahender Singh Meena", subject: "ABST" },
  { prefix: "Sh.", name: "Sh. Ramesh Chand Sharma", subject: "ABST" },
  { prefix: "Sh.", name: "Sh. Raju Lal Meena", subject: "Physical Education" },
];

export const TEACHERS: Teacher[] = RAW.map((t, i) => {
  const id = i + 1;
  let role: string;
  if (id === 1) {
    role = "Principal";
  } else if (t.prefix === "Dr.") {
    role = "Associate Professor";
  } else {
    role = "Assistant Professor";
  }
  const rating = 4.0 + ((id * 17) % 10) / 10;
  const experience = 3 + ((id * 13) % 13);
  return {
    id,
    name: t.name,
    subject: t.subject,
    prefix: t.prefix,
    role,
    rating,
    experience,
    phone: getPhone(id),
    email: getEmail(t.name, t.prefix),
    avatarColor: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
    initials: getInitials(t.name, t.prefix),
  };
});

export const SUBJECTS = Array.from(
  new Set(TEACHERS.map((t) => t.subject)),
).sort();
