import { Principal } from "@icp-sdk/core/principal";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { StudentProfile } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllStudentProfiles,
  useChatHistory,
  useSendMessage,
} from "../hooks/useQueries";

function bigintToTime(t: bigint): string {
  return new Date(Number(t / 1_000_000n)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatPage() {
  const { identity } = useInternetIdentity();
  const { data: profiles } = useAllStudentProfiles();
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendMessage();

  const receiverPrincipal = selectedProfile
    ? (() => {
        try {
          return Principal.fromText(selectedProfile.studentId);
        } catch {
          return null;
        }
      })()
    : null;

  const { data: history } = useChatHistory(receiverPrincipal);
  const myPrincipal = identity?.getPrincipal().toString();

  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesEndRef is stable
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  async function handleSend() {
    if (!message.trim() || !receiverPrincipal) return;
    const content = message.trim();
    setMessage("");
    try {
      await sendMessage.mutateAsync({ content, receiverId: receiverPrincipal });
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">
      {/* User list */}
      <div className="w-64 flex-shrink-0 glass-card flex flex-col overflow-hidden">
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <h3 className="font-semibold text-sm" style={{ color: "#F2F6FF" }}>
            Students
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {(profiles ?? []).map((p, i) => (
            <button
              type="button"
              key={p.studentId}
              onClick={() => setSelectedProfile(p)}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
              style={{
                background:
                  selectedProfile?.studentId === p.studentId
                    ? "rgba(34,211,238,0.15)"
                    : "transparent",
                border:
                  selectedProfile?.studentId === p.studentId
                    ? "1px solid rgba(34,211,238,0.30)"
                    : "1px solid transparent",
              }}
              data-ocid={`chat.user.item.${i + 1}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #22D3EE33, #2B8FEA33)",
                  color: "#22D3EE",
                }}
              >
                {p.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <div
                  className="text-xs font-medium truncate"
                  style={{ color: "#F2F6FF" }}
                >
                  {p.name}
                </div>
                <div className="text-xs truncate" style={{ color: "#A9B7C8" }}>
                  {p.course}
                </div>
              </div>
            </button>
          ))}
          {(profiles ?? []).length === 0 && (
            <div
              className="text-center py-8"
              style={{ color: "#A9B7C8" }}
              data-ocid="chat.users.empty_state"
            >
              <MessageSquare className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs">No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {selectedProfile ? (
          <>
            {/* Header */}
            <div
              className="p-4 border-b flex items-center gap-3"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #22D3EE, #2B8FEA)",
                  color: "#071527",
                }}
              >
                {selectedProfile.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div
                  className="font-semibold text-sm"
                  style={{ color: "#F2F6FF" }}
                >
                  {selectedProfile.name}
                </div>
                <div className="text-xs" style={{ color: "#34D399" }}>
                  ● Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(history ?? []).map((msg, i) => {
                const isMine = msg.senderId.toString() === myPrincipal;
                return (
                  <div
                    key={String(msg.id)}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    data-ocid={`chat.message.item.${i + 1}`}
                  >
                    <div
                      className="max-w-xs px-4 py-2 rounded-2xl text-sm"
                      style={{
                        background: isMine
                          ? "linear-gradient(135deg, #22D3EE, #2B8FEA)"
                          : "rgba(255,255,255,0.08)",
                        color: isMine ? "#071527" : "#F2F6FF",
                        borderRadius: isMine
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      }}
                    >
                      <p>{msg.content}</p>
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: isMine ? "rgba(7,21,39,0.6)" : "#A9B7C8",
                        }}
                      >
                        {bigintToTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {(history ?? []).length === 0 && (
                <div
                  className="text-center py-12"
                  style={{ color: "#A9B7C8" }}
                  data-ocid="chat.messages.empty_state"
                >
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No messages yet. Say hello!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="p-4 border-t flex gap-3"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm outline-none px-4 py-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#F2F6FF",
                }}
                data-ocid="chat.message.input"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() || sendMessage.isPending}
                className="btn-primary p-2.5 rounded-xl disabled:opacity-50 flex-shrink-0"
                data-ocid="chat.send.button"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center"
            style={{ color: "#A9B7C8" }}
            data-ocid="chat.empty_state"
          >
            <MessageSquare
              className="h-12 w-12 mb-4"
              style={{ color: "#22D3EE", opacity: 0.5 }}
            />
            <p className="text-lg font-medium" style={{ color: "#F2F6FF" }}>
              Select a student
            </p>
            <p className="text-sm mt-1">Choose someone to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
