"use client";
import Link from "next/link";
import { Cog6ToothIcon, ArrowDownTrayIcon, PencilSquareIcon, SunIcon, MoonIcon, CalendarDaysIcon, CalendarIcon, SparklesIcon, HeartIcon, CloudIcon } from "@heroicons/react/24/outline";
import { Theme, useTheme } from "../components/ThemeProvider";
import { useViewMode } from "../useViewMode";
import { Button } from "../components/Button";
import React from "react";


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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { viewMode, save } = useViewMode();

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Cog6ToothIcon className="w-7 h-7 text-gray-500" />
        Asetukset
      </h1>
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