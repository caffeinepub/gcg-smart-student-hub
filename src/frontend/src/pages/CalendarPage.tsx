import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import type { CalendarEvent } from "../backend";
import { useCalendarEvents } from "../hooks/useQueries";

function bigintToDate(t: bigint): Date {
  return new Date(Number(t / 1_000_000n));
}

const EVENT_COLORS: Record<string, { bg: string; text: string; dot: string }> =
  {
    exam: { bg: "rgba(239,68,68,0.15)", text: "#FCA5A5", dot: "#EF4444" },
    assignment: { bg: "rgba(234,179,8,0.15)", text: "#FDE68A", dot: "#EAB308" },
    practical: { bg: "rgba(139,92,246,0.15)", text: "#C4B5FD", dot: "#8B5CF6" },
    holiday: { bg: "rgba(52,211,153,0.15)", text: "#6EE7B7", dot: "#34D399" },
  };

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  const { data: events } = useCalendarEvents();

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getEventsForDay(day: number): CalendarEvent[] {
    if (!events) return [];
    return events.filter((e) => {
      const d = bigintToDate(e.date);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });
  }

  function handleDayClick(day: number) {
    const d = new Date(year, month, day);
    setSelectedDate(d);
    setSelectedEvents(getEventsForDay(day));
  }

  const cells: { key: string; day: number | null }[] = [];
  for (let i = 0; i < firstDay; i++) cells.push({ key: `pad-${i}`, day: null });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ key: `day-${d}`, day: d });

  return (
    <div className="space-y-5">
      {/* Legend */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        {Object.entries(EVENT_COLORS).map(([type, c]) => (
          <div key={type} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: c.dot }}
            />
            <span className="capitalize" style={{ color: "#A9B7C8" }}>
              {type}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="glass-card p-5">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: "#A9B7C8" }}
            data-ocid="calendar.prev.button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold" style={{ color: "#F2F6FF" }}>
            {MONTHS[month]} {year}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: "#A9B7C8" }}
            data-ocid="calendar.next.button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold py-2"
              style={{ color: "#A9B7C8" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map(({ key, day }) => {
            if (!day) return <div key={key} />;
            const dayEvents = getEventsForDay(day);
            const isToday =
              today.getFullYear() === year &&
              today.getMonth() === month &&
              today.getDate() === day;
            const isSelected =
              selectedDate?.getDate() === day &&
              selectedDate?.getMonth() === month &&
              selectedDate?.getFullYear() === year;
            return (
              <button
                type="button"
                key={key}
                onClick={() => handleDayClick(day)}
                className="relative flex flex-col items-center py-2 rounded-lg transition-all hover:bg-white/10"
                style={{
                  background: isSelected
                    ? "rgba(34,211,238,0.20)"
                    : isToday
                      ? "rgba(43,143,234,0.15)"
                      : "transparent",
                  border: isToday
                    ? "1px solid rgba(43,143,234,0.40)"
                    : isSelected
                      ? "1px solid rgba(34,211,238,0.40)"
                      : "1px solid transparent",
                }}
                data-ocid="calendar.day.button"
              >
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isToday
                      ? "#22D3EE"
                      : isSelected
                        ? "#22D3EE"
                        : "#F2F6FF",
                  }}
                >
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <div
                        key={String(e.id)}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            EVENT_COLORS[e.eventType]?.dot ?? "#A9B7C8",
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Event popup */}
      {selectedDate && (
        <div className="glass-card p-5" data-ocid="calendar.event.panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "#F2F6FF" }}>
              {selectedDate.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="p-1 rounded-lg hover:bg-white/10"
              style={{ color: "#A9B7C8" }}
              data-ocid="calendar.event.close_button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {selectedEvents.length === 0 ? (
            <p className="text-sm" style={{ color: "#A9B7C8" }}>
              No events on this day
            </p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((e, i) => {
                const c = EVENT_COLORS[e.eventType] ?? EVENT_COLORS.exam;
                return (
                  <div
                    key={String(e.id)}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: c.bg, border: `1px solid ${c.dot}33` }}
                    data-ocid={`calendar.event.item.${i + 1}`}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: c.dot }}
                    />
                    <div>
                      <div
                        className="font-medium text-sm"
                        style={{ color: c.text }}
                      >
                        {e.title}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "#A9B7C8" }}
                      >
                        {e.description}
                      </div>
                      <div
                        className="text-xs mt-1 px-2 py-0.5 rounded inline-block capitalize"
                        style={{ background: c.bg, color: c.text }}
                      >
                        {e.eventType}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
