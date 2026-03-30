import { GraduationCap, Loader2, Shield, Zap } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn, isLoginError } = useInternetIdentity();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated blobs */}
      <div
        className="blob-1 absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(43,143,234,0.10) 60%, transparent 80%)",
          top: "-10%",
          left: "-10%",
          filter: "blur(40px)",
        }}
      />
      <div
        className="blob-2 absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(43,143,234,0.08) 60%, transparent 80%)",
          bottom: "5%",
          right: "-5%",
          filter: "blur(50px)",
        }}
      />
      <div
        className="blob-3 absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)",
          bottom: "20%",
          left: "10%",
          filter: "blur(35px)",
        }}
      />

      {/* Login card */}
      <div className="glass-card w-full max-w-md mx-4 p-10 flex flex-col items-center gap-6 z-10">
        {/* Logo */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
          style={{
            background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
            color: "#071527",
            boxShadow: "0 8px 30px rgba(34,211,238,0.35)",
          }}
        >
          GC
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold" style={{ color: "#F2F6FF" }}>
            Government College
          </h1>
          <p className="text-sm font-medium" style={{ color: "#22D3EE" }}>
            Gangapur City
          </p>
          <p
            className="mt-2 text-xs uppercase tracking-widest font-semibold"
            style={{ color: "#A9B7C8" }}
          >
            Smart Student Hub
          </p>
        </div>

        <div
          className="w-full h-px"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        <div className="w-full text-center">
          <h2 className="text-2xl font-bold mb-1" style={{ color: "#F2F6FF" }}>
            Welcome Back
          </h2>
          <p className="text-sm" style={{ color: "#A9B7C8" }}>
            Sign in to access your student portal
          </p>
        </div>

        {isLoginError && (
          <div
            className="w-full rounded-lg px-4 py-3 text-sm"
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.30)",
              color: "#FCA5A5",
            }}
            data-ocid="login.error_state"
          >
            Login failed. Please try again.
          </div>
        )}

        <button
          type="button"
          onClick={() => login()}
          disabled={isLoggingIn}
          className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          data-ocid="login.primary_button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              Sign in with Internet Identity
            </>
          )}
        </button>

        <div className="w-full grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "Secure" },
            { icon: Zap, label: "Fast" },
            { icon: GraduationCap, label: "Smart" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 py-3 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Icon className="h-4 w-4" style={{ color: "#22D3EE" }} />
              <span className="text-xs" style={{ color: "#A9B7C8" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-center" style={{ color: "#A9B7C8" }}>
          Powered by Internet Computer Protocol · Decentralized & Secure
        </p>
      </div>
    </div>
  );
}
