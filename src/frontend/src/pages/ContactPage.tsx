import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-5" style={{ color: "#F2F6FF" }}>
            Send a Message
          </h2>
          {submitted ? (
            <div
              className="flex flex-col items-center gap-3 py-10"
              data-ocid="contact.success_state"
            >
              <CheckCircle className="h-10 w-10" style={{ color: "#34D399" }} />
              <p className="font-semibold" style={{ color: "#F2F6FF" }}>
                Message Sent!
              </p>
              <p className="text-sm text-center" style={{ color: "#A9B7C8" }}>
                Thank you for reaching out.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "#A9B7C8" }}
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#F2F6FF",
                  }}
                  data-ocid="contact.name.input"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "#A9B7C8" }}
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#F2F6FF",
                  }}
                  data-ocid="contact.email.input"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "#A9B7C8" }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#F2F6FF",
                  }}
                  data-ocid="contact.message.textarea"
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold"
                data-ocid="contact.submit.button"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4" style={{ color: "#F2F6FF" }}>
              Contact Information
            </h3>
            <div className="space-y-4">
              {(
                [
                  {
                    icon: MapPin,
                    label: "Address",
                    value:
                      "Government College, Gangapur City, Sawai Madhopur, Rajasthan - 322201",
                  },
                  { icon: Phone, label: "Phone", value: "+91 7462-245678" },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "info@gcgangapurcity.ac.in",
                  },
                ] as const
              ).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ background: "rgba(34,211,238,0.12)" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "#22D3EE" }} />
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium mb-0.5"
                      style={{ color: "#A9B7C8" }}
                    >
                      {label}
                    </div>
                    <div className="text-sm" style={{ color: "#F2F6FF" }}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="glass-card overflow-hidden rounded-xl"
            style={{
              height: "180px",
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.08), rgba(43,143,234,0.08))",
            }}
          >
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <MapPin
                className="h-8 w-8"
                style={{ color: "#22D3EE", opacity: 0.6 }}
              />
              <p className="text-sm font-medium" style={{ color: "#A9B7C8" }}>
                Gangapur City, Rajasthan
              </p>
              <p className="text-xs" style={{ color: "#A9B7C8" }}>
                26.4731° N, 76.7139° E
              </p>
            </div>
          </div>

          <div className="glass-card p-5">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#F2F6FF" }}
            >
              Office Hours
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { day: "Monday – Friday", time: "9:00 AM – 5:00 PM" },
                { day: "Saturday", time: "9:00 AM – 1:00 PM" },
                { day: "Sunday", time: "Closed" },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between">
                  <span style={{ color: "#A9B7C8" }}>{day}</span>
                  <span style={{ color: "#F2F6FF" }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
