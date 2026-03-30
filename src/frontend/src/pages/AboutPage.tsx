import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  Globe,
  HelpCircle,
  Instagram,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  Shield,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FAQ_ITEMS = [
  {
    q: "How do I reset my password?",
    a: "Contact your college admin or use the Forgot Password option on the login screen.",
  },
  {
    q: "Where can I view my attendance?",
    a: "Go to Subjects and click on any subject to see detailed attendance.",
  },
  {
    q: "How do I submit an assignment?",
    a: "Open the subject, find the assignment, and click Submit.",
  },
  {
    q: "Can I chat with my teachers?",
    a: "Yes! Use the Chat section to message teachers and classmates.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. EduConnect runs on the Internet Computer blockchain, ensuring your data is secure and decentralized.",
  },
];

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </div>
  );
}

function HelpDialog({
  title,
  description,
  icon: Icon,
  color,
  inputType,
  placeholder,
  toastMsg,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  inputType: "textarea" | "input";
  placeholder: string;
  toastMsg: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const key = title.toLowerCase().replace(/\s+/g, "_");

  const handleSubmit = () => {
    if (!value.trim()) {
      toast.error("Please enter something before submitting.");
      return;
    }
    toast.success(toastMsg);
    setValue("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="btn-primary px-4 py-2 text-sm rounded-xl w-full mt-3"
          data-ocid={`help.${key}.open_modal_button`}
        >
          Open
        </button>
      </DialogTrigger>
      <DialogContent
        className="glass-card border-0 max-w-md"
        style={{
          background: "rgba(7,21,39,0.92)",
          backdropFilter: "blur(20px)",
          color: "#F2F6FF",
        }}
        data-ocid={`help.${key}.dialog`}
      >
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2 text-lg font-bold"
            style={{ color: "#F2F6FF" }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm mb-3" style={{ color: "#A9B7C8" }}>
          {description}
        </p>
        {inputType === "textarea" ? (
          <textarea
            className="w-full rounded-xl p-3 text-sm resize-none outline-none"
            rows={4}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F2F6FF",
            }}
            data-ocid={`help.${key}.textarea`}
          />
        ) : (
          <input
            className="w-full rounded-xl p-3 text-sm outline-none"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F2F6FF",
            }}
            data-ocid={`help.${key}.input`}
          />
        )}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className="btn-primary px-5 py-2 text-sm rounded-xl flex-1"
            onClick={handleSubmit}
            data-ocid={`help.${key}.submit_button`}
          >
            Submit
          </button>
          <button
            type="button"
            className="px-5 py-2 text-sm rounded-xl"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#A9B7C8",
            }}
            onClick={() => setOpen(false)}
            data-ocid={`help.${key}.cancel_button`}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LegalDialog({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);
  const key = title.toLowerCase().replace(/\s+/g, "_").replace(/&/g, "and");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#A9B7C8",
          }}
          data-ocid={`legal.${key}.open_modal_button`}
        >
          <FileText className="h-4 w-4" />
          {title}
        </button>
      </DialogTrigger>
      <DialogContent
        className="glass-card border-0 max-w-lg"
        style={{
          background: "rgba(7,21,39,0.92)",
          backdropFilter: "blur(20px)",
          color: "#F2F6FF",
        }}
        data-ocid={`legal.${key}.dialog`}
      >
        <DialogHeader>
          <DialogTitle className="font-bold" style={{ color: "#F2F6FF" }}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-relaxed" style={{ color: "#A9B7C8" }}>
          {content}
        </p>
        <button
          type="button"
          className="btn-primary px-5 py-2 text-sm rounded-xl mt-4 w-full"
          onClick={() => setOpen(false)}
          data-ocid={`legal.${key}.close_button`}
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
}

export default function AboutPage() {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleShare = async () => {
    const text =
      "Check out EduConnect: Smart Campus, Smart Students! https://educonnect.edu";
    if (navigator.share) {
      try {
        await navigator.share({ title: "EduConnect", text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied!");
    }
  };

  const handleRate = (stars: number) => {
    setRating(stars);
    toast.success(`Thanks for rating us ${stars} star${stars > 1 ? "s" : ""}!`);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* 1. App Identity Hero */}
      <Section delay={0}>
        <div
          className="glass-card p-10 text-center relative overflow-hidden"
          data-ocid="about.section"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute top-4 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-20"
              style={{ background: "#22D3EE" }}
            />
            <div
              className="absolute bottom-4 right-1/4 w-40 h-40 rounded-full blur-3xl opacity-15"
              style={{ background: "#2B8FEA" }}
            />
          </div>

          <div
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-black mb-5 relative z-10"
            style={{
              background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
              color: "#071527",
              boxShadow: "0 10px 40px rgba(34,211,238,0.4)",
            }}
          >
            EC
          </div>

          <h1
            className="text-4xl font-black mb-1 gradient-text relative z-10"
            style={{ letterSpacing: "-0.02em" }}
          >
            EduConnect
          </h1>
          <p
            className="text-lg mb-4 relative z-10"
            style={{ color: "#A9B7C8" }}
          >
            Smart Campus, Smart Students
          </p>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold relative z-10"
            style={{
              background: "rgba(34,211,238,0.15)",
              border: "1px solid rgba(34,211,238,0.3)",
              color: "#22D3EE",
            }}
          >
            <CheckCircle className="h-3 w-3" />
            v1.0.0
          </span>
        </div>
      </Section>

      {/* 2. About + Mission */}
      <Section delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card p-6" data-ocid="about.panel">
            <div
              className="p-2.5 rounded-xl w-fit mb-4"
              style={{ background: "rgba(34,211,238,0.15)" }}
            >
              <BookOpen className="h-5 w-5" style={{ color: "#22D3EE" }} />
            </div>
            <h2 className="text-lg font-bold mb-3" style={{ color: "#F2F6FF" }}>
              About EduConnect
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#A9B7C8" }}>
              EduConnect is a smart college application designed to help
              students manage their academic details effortlessly. It bridges
              the gap between students, teachers, and college resources —
              putting your entire campus in your pocket.
            </p>
          </div>

          <div className="glass-card p-6" data-ocid="mission.panel">
            <div
              className="p-2.5 rounded-xl w-fit mb-4"
              style={{ background: "rgba(43,143,234,0.15)" }}
            >
              <Lightbulb className="h-5 w-5" style={{ color: "#2B8FEA" }} />
            </div>
            <h2 className="text-lg font-bold mb-3" style={{ color: "#F2F6FF" }}>
              Our Mission
            </h2>
            <ul className="space-y-2.5">
              {[
                "Make student life easy & digital",
                "Improve communication in college",
                "Provide smart learning tools",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "#A9B7C8" }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: "#2B8FEA" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 3. Contact & Support */}
      <Section delay={160}>
        <div className="glass-card p-6" data-ocid="contact.section">
          <div className="flex items-center gap-2 mb-5">
            <Phone className="h-5 w-5" style={{ color: "#22D3EE" }} />
            <h2 className="text-lg font-bold" style={{ color: "#F2F6FF" }}>
              Contact & Support
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "rgba(34,211,238,0.1)" }}
                >
                  <Mail className="h-4 w-4" style={{ color: "#22D3EE" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#A9B7C8" }}>
                    Email
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#F2F6FF" }}
                  >
                    support@educonnect.edu
                  </p>
                </div>
              </div>
              <a
                href="mailto:support@educonnect.edu"
                className="btn-primary px-4 py-1.5 text-xs rounded-lg"
                data-ocid="contact.email.button"
              >
                Send Email
              </a>
            </div>

            <div
              className="h-px w-full"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "rgba(43,143,234,0.1)" }}
                >
                  <Phone className="h-4 w-4" style={{ color: "#2B8FEA" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#A9B7C8" }}>
                    Phone
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#F2F6FF" }}
                  >
                    +91 98765 43210
                  </p>
                </div>
              </div>
              <a
                href="tel:+919876543210"
                className="btn-primary px-4 py-1.5 text-xs rounded-lg"
                data-ocid="contact.phone.button"
              >
                Call Now
              </a>
            </div>

            <div
              className="h-px w-full"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />

            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: "rgba(52,211,153,0.1)" }}
              >
                <Clock className="h-4 w-4" style={{ color: "#34D399" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#A9B7C8" }}>
                  Working Hours
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#F2F6FF" }}
                >
                  Mon–Sat, 9:00 AM – 5:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Help Options */}
      <Section delay={240}>
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: "#F2F6FF" }}>
            💬 Help Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <div
                className="p-2.5 rounded-xl w-fit mb-3"
                style={{ background: "rgba(239,68,68,0.15)" }}
              >
                <AlertTriangle
                  className="h-5 w-5"
                  style={{ color: "#EF4444" }}
                />
              </div>
              <h3
                className="font-semibold text-sm mb-1"
                style={{ color: "#F2F6FF" }}
              >
                🛠 Report a Problem
              </h3>
              <p className="text-xs" style={{ color: "#A9B7C8" }}>
                Found a bug or issue? Let us know.
              </p>
              <HelpDialog
                title="Report a Problem"
                description="Describe the problem you encountered."
                icon={AlertTriangle}
                color="#EF4444"
                inputType="textarea"
                placeholder="Describe the problem..."
                toastMsg="Problem reported! We'll look into it."
              />
            </div>

            <div className="glass-card p-5">
              <div
                className="p-2.5 rounded-xl w-fit mb-3"
                style={{ background: "rgba(251,191,36,0.15)" }}
              >
                <MessageSquare
                  className="h-5 w-5"
                  style={{ color: "#FBBF24" }}
                />
              </div>
              <h3
                className="font-semibold text-sm mb-1"
                style={{ color: "#F2F6FF" }}
              >
                💡 Send Feedback
              </h3>
              <p className="text-xs" style={{ color: "#A9B7C8" }}>
                Share ideas or suggestions with us.
              </p>
              <HelpDialog
                title="Send Feedback"
                description="We'd love to hear your thoughts!"
                icon={MessageSquare}
                color="#FBBF24"
                inputType="textarea"
                placeholder="Your feedback..."
                toastMsg="Thanks for your feedback!"
              />
            </div>

            <div className="glass-card p-5">
              <div
                className="p-2.5 rounded-xl w-fit mb-3"
                style={{ background: "rgba(34,211,238,0.15)" }}
              >
                <HelpCircle className="h-5 w-5" style={{ color: "#22D3EE" }} />
              </div>
              <h3
                className="font-semibold text-sm mb-1"
                style={{ color: "#F2F6FF" }}
              >
                ❓ Ask for Help
              </h3>
              <p className="text-xs" style={{ color: "#A9B7C8" }}>
                Have a question? We're here to help.
              </p>
              <HelpDialog
                title="Ask for Help"
                description="Type your question below."
                icon={HelpCircle}
                color="#22D3EE"
                inputType="input"
                placeholder="Your question..."
                toastMsg="Your question has been sent!"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* 5. Social Links */}
      <Section delay={320}>
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: "#F2F6FF" }}>
            🌐 Social Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Website",
                icon: Globe,
                color: "#2B8FEA",
                glow: "rgba(43,143,234,0.3)",
                url: "https://educonnect.edu",
                ocid: "social.website.button",
              },
              {
                label: "Instagram",
                icon: Instagram,
                color: "#E1306C",
                glow: "rgba(225,48,108,0.3)",
                url: "https://instagram.com/educonnect",
                ocid: "social.instagram.button",
              },
              {
                label: "LinkedIn",
                icon: Linkedin,
                color: "#0A66C2",
                glow: "rgba(10,102,194,0.3)",
                url: "https://linkedin.com/company/educonnect",
                ocid: "social.linkedin.button",
              },
            ].map(({ label, icon: Icon, color, glow, url, ocid }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 flex items-center gap-3 cursor-pointer transition-all duration-300"
                style={{ textDecoration: "none" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    `0 0 24px ${glow}`;
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    `${color}44`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 12px 30px rgba(0,0,0,0.3)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(255,255,255,0.12)";
                }}
                data-ocid={ocid}
              >
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: `${color}22` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#F2F6FF" }}
                  >
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: "#A9B7C8" }}>
                    Follow us
                  </p>
                </div>
                <ExternalLink
                  className="h-3.5 w-3.5 ml-auto"
                  style={{ color: "#A9B7C8" }}
                />
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* 6. Location */}
      <Section delay={400}>
        <div className="glass-card p-6" data-ocid="location.section">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5" style={{ color: "#22D3EE" }} />
            <h2 className="text-lg font-bold" style={{ color: "#F2F6FF" }}>
              📍 Location
            </h2>
          </div>
          <p className="text-sm mb-4" style={{ color: "#A9B7C8" }}>
            Government College, Gangapur City, Rajasthan 322201
          </p>
          <a
            href="https://maps.google.com/?q=Government+College+Gangapur+City+Rajasthan"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl"
            data-ocid="location.map.button"
          >
            <MapPin className="h-4 w-4" />
            Open in Google Maps
          </a>
        </div>
      </Section>

      {/* 7. Developer Info */}
      <Section delay={480}>
        <div className="glass-card p-5" data-ocid="developer.card">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
                color: "#071527",
              }}
            >
              <Code2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                style={{ color: "#22D3EE" }}
              >
                👨‍💻 Developer
              </p>
              <p className="text-sm font-bold" style={{ color: "#F2F6FF" }}>
                EduConnect Dev Team
              </p>
            </div>
            <a
              href="mailto:dev@educonnect.edu"
              className="text-sm"
              style={{ color: "#A9B7C8" }}
              data-ocid="developer.email.button"
            >
              dev@educonnect.edu
            </a>
          </div>
        </div>
      </Section>

      {/* 8. FAQ */}
      <Section delay={560}>
        <div data-ocid="faq.section">
          <h2 className="text-lg font-bold mb-4" style={{ color: "#F2F6FF" }}>
            Frequently Asked Questions ❓
          </h2>
          <div className="glass-card px-4 py-2">
            <Accordion type="single" collapsible>
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  style={{ borderColor: "rgba(255,255,255,0.07)" }}
                  data-ocid={`faq.item.${i + 1}`}
                >
                  <AccordionTrigger
                    className="text-sm font-semibold text-left py-4 hover:no-underline"
                    style={{ color: "#F2F6FF" }}
                  >
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-sm pb-4"
                    style={{ color: "#A9B7C8" }}
                  >
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>

      {/* 9. Rate + Share */}
      <Section delay={640}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="glass-card p-6 text-center" data-ocid="rate.card">
            <div className="text-2xl mb-2">⭐</div>
            <h3 className="font-bold mb-1" style={{ color: "#F2F6FF" }}>
              Rate EduConnect
            </h3>
            <p className="text-xs mb-4" style={{ color: "#A9B7C8" }}>
              Enjoying the app? Give us a rating!
            </p>
            <div className="flex justify-center gap-2" data-ocid="rate.toggle">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Star
                    className="h-8 w-8"
                    style={{
                      color:
                        star <= (hoveredStar || rating)
                          ? "#FBBF24"
                          : "rgba(255,255,255,0.2)",
                      fill:
                        star <= (hoveredStar || rating)
                          ? "#FBBF24"
                          : "transparent",
                      transition: "all 0.15s",
                    }}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs mt-3" style={{ color: "#22D3EE" }}>
                You rated {rating} star{rating > 1 ? "s" : ""}!
              </p>
            )}
          </div>

          <div className="glass-card p-6 text-center" data-ocid="share.card">
            <div className="text-2xl mb-2">📤</div>
            <h3 className="font-bold mb-1" style={{ color: "#F2F6FF" }}>
              Share EduConnect
            </h3>
            <p className="text-xs mb-6" style={{ color: "#A9B7C8" }}>
              Help your friends discover EduConnect!
            </p>
            <button
              type="button"
              onClick={handleShare}
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl"
              data-ocid="share.primary_button"
            >
              <Share2 className="h-4 w-4" />
              Share App
            </button>
          </div>
        </div>
      </Section>

      {/* 10. Legal */}
      <Section delay={720}>
        <div className="glass-card p-6" data-ocid="legal.section">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5" style={{ color: "#22D3EE" }} />
            <h2 className="text-lg font-bold" style={{ color: "#F2F6FF" }}>
              Legal
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <LegalDialog
              title="Privacy Policy"
              content="EduConnect is committed to protecting your privacy. We collect only necessary academic data to provide our services. Your data is stored securely on the Internet Computer blockchain and is never shared with third parties without your consent. You may request deletion of your data at any time by contacting our support team. By using EduConnect, you agree to these terms."
            />
            <LegalDialog
              title="Terms & Conditions"
              content="By using EduConnect, you agree to use the platform solely for educational purposes within Government College Gangapur City. You are responsible for maintaining the confidentiality of your account credentials. Any misuse, unauthorized access, or violation of college policies may result in account suspension. EduConnect reserves the right to update these terms at any time with prior notice."
            />
          </div>
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center text-xs pt-4" style={{ color: "#A9B7C8" }}>
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#22D3EE" }}
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
