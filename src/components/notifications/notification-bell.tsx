"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  data: Notification[];
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);

  async function load() {
    const response = await fetch("/api/notifications", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as NotificationsResponse;
    setItems(payload.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function markAsRead(notificationId: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId }),
    });

    setItems((previous) =>
      previous.map((item) =>
        item.id === notificationId
          ? {
              ...item,
              isRead: true,
            }
          : item,
      ),
    );
  }

  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

  return (
    <div className="relative">
      <button
        type="button"
        className="relative rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
        onClick={() => {
          setOpen((value) => !value);
          if (!open) {
            void load();
          }
        }}
      >
        Notifications
        {unreadCount > 0 ? (
          <span className="ml-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">{unreadCount}</span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Recent notifications</h3>
          <div className="max-h-80 space-y-2 overflow-auto pr-1">
            {items.map((item) => (
              <article
                key={item.id}
                className={`rounded-md border p-3 ${item.isRead ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50"}`}
              >
                <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-700">{item.message}</p>
                <p className="mt-1 text-[11px] text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-3">
                  {item.linkUrl ? (
                    <Link href={item.linkUrl} className="text-xs font-semibold text-slate-900 underline" onClick={() => void markAsRead(item.id)}>
                      Open
                    </Link>
                  ) : null}
                  {!item.isRead ? (
                    <button type="button" onClick={() => void markAsRead(item.id)} className="text-xs font-semibold text-slate-700 underline">
                      Mark as read
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
            {items.length === 0 ? <p className="text-xs text-slate-600">No notifications yet.</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
