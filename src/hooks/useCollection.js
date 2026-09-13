import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";

export function useCollection(collection, params) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const key = JSON.stringify(params ?? {});

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await api.list(collection, JSON.parse(key)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [collection, key]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, reload };
}
