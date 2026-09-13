import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";

const SettingsContext = createContext(null);

const FALLBACK = {
  labName: "Research Lab",
  shortName: "Lab",
  institution: "",
  tagline: "",
  intro: "",
  researchOverview: "",
  address: "",
  phone: "",
  email: "",
  mapNote: "",
  heroImageUrl: "",
  aboutImageUrl: "",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const data = await api.getSettings();
      setSettings({ ...FALLBACK, ...data });
    } catch {
      setSettings(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <SettingsContext.Provider value={{ settings, loading, reload }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
