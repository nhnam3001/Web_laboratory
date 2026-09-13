import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function useSecretDashboardShortcut(enabled = true) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      const isCtrlA = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a";
      if (!isCtrlA) return;

      const target = e.target;
      const isEditable =
        EDITABLE_TAGS.has(target?.tagName) || target?.isContentEditable;
      if (isEditable) return;

      e.preventDefault();
      navigate("/dashboard");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, enabled]);
}
