"use client";
import Link from "next/link";
import { Cog6ToothIcon, ArrowDownTrayIcon, PencilSquareIcon, SunIcon, MoonIcon, CalendarDaysIcon, CalendarIcon, SparklesIcon, HeartIcon, CloudIcon } from "@heroicons/react/24/outline";
import { Theme, useTheme } from "../components/ThemeProvider";
import { useViewMode } from "../useViewMode";
import { Button } from "../components/Button";
import React, { useState } from "react";
import { useAppState } from "../AppStateContext";


function RainbowIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rainbow-gradient" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f87171" />
          <stop offset="0.25" stopColor="#fbbf24" />
          <stop offset="0.5" stopColor="#34d399" />
          <stop offset="0.75" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path d="M4 18a8 8 0 0116 0" stroke="url(#rainbow-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M8 18a4 4 0 018 0" stroke="url(#rainbow-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const themes = [
  { name: "Vaalea", value: "white", icon: SunIcon, color: "text-yellow-400" },
  { name: "Tumma", value: "dark", icon: MoonIcon, color: "text-gray-700" },
  { name: "Pinkki", value: "pink", icon: HeartIcon, color: "text-pink-500" },
  { name: "Vihreä", value: "green", icon: SparklesIcon, color: "text-green-500" },
  { name: "Taivas", value: "sky", icon: CloudIcon, color: "text-sky-400" },
  { name: "Sateenkaari", value: "rainbow", icon: RainbowIcon, color: "" },
];

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { userInfo, username, showToast } = useAppState();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const credentials = btoa(`${username}:${oldPassword}`);
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/' + userInfo?.uuid + '/resetpassword', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Salasanan vaihto epäonnistui");
      }
      showToast("Salasana vaihdettu!", "success");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Salasanan vaihto epäonnistui");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">Vaihda salasana</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block mb-1 font-medium">Nykyinen salasana</label>
            <input
              id="oldPassword"
              type="password"
              className="w-full border p-2 rounded"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block mb-1 font-medium">Uusi salasana</label>
            <input
              id="newPassword"
              type="password"
              className="w-full border p-2 rounded"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
            {isLoading ? "Vaihdetaan..." : "Vaihda salasana"}
          </Button>
        </form>
        <Button type="button" variant="secondary" onClick={onClose} className="w-full mt-2">Peruuta</Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { viewMode, save } = useViewMode();
  const { userMode } = useAppState();
  const [showChangePw, setShowChangePw] = useState(false);

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Cog6ToothIcon className="w-7 h-7 text-gray-500" />
        Asetukset
      </h1>
      {userMode === "authenticated" && (
        <div className="mb-4">
          <Button variant="primary" onClick={() => setShowChangePw(true)}>
            Vaihda salasana
          </Button>
          <ChangePasswordModal open={showChangePw} onClose={() => setShowChangePw(false)} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Link href="/settings/import-export" className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-fit">
          <ArrowDownTrayIcon className="w-5 h-5" />
          Tuo/Vie tiedot
        </Link>
        <Link href="/settings/manage" className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition w-fit">
          <PencilSquareIcon className="w-5 h-5" />
          Muokkaa reseptejä
        </Link>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Teema</h2>
        <div className="flex gap-4 flex-wrap">
          {themes.map(({ name, value, icon: Icon, color }) => (
            <Button
              key={value}
              variant={theme === value ? "primary" : "outline"}
              className={`theme-button flex items-center gap-2 ${theme === value ? "ring-2 ring-blue-300" : ""}`}
              onClick={() => setTheme(value as Theme)}
              type="button"
            >
              <Icon className={`w-5 h-5 ${color}`} />
              {name}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Etusivun näkymä</h2>
        <div className="flex gap-4">
          <Button
            variant={viewMode === "week" ? "primary" : "outline"}
            className="flex items-center gap-2"
            onClick={() => { save("week") }}
            type="button"
          >
            <CalendarDaysIcon className="w-5 h-5" />
            Viikko
          </Button>
          <Button
            variant={viewMode === "month" ? "primary" : "outline"}
            className="flex items-center gap-2"
            onClick={() => { save("month") }}
            type="button"
          >
            <CalendarIcon className="w-5 h-5" />
            Koko kuukausi
          </Button>
        </div>
      </div>
    </div>
  );
} 