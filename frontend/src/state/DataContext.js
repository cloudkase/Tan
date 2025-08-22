import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  /**
   * Fetch items from the backend.
   * If opts.paginate = true, returns pagination object { data, page, limit, total, pages }.
   * Otherwise, sets state directly with array of items.
   */
  const fetchItems = useCallback(async (signal, opts = {}) => {
    const params = new URLSearchParams();
    if (opts.paginate) params.set('paginate', 'true');
    if (opts.page) params.set('page', opts.page);
    if (opts.limit) params.set('limit', opts.limit);
    const res = await fetch('/api/items?' + params.toString(), { signal });
    if (!res.ok) throw new Error('Failed to fetch items');
    const json = await res.json();
    if (opts.paginate) {
      setItems(json.data);
      return json;
    } else {
      setItems(json);
      return { data: json };
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
