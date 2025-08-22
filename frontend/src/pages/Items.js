import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

/**
 * Items page
 * - Legacy mode (default): uses DataContext to fetch an array of items
 * - Paginated mode: enable with REACT_APP_USE_PAGINATION=true
 */
function Items() {
  const usePagination = String(process.env.REACT_APP_USE_PAGINATION).toLowerCase() === 'true';

  // Legacy mode via context
  const { items, fetchItems } = useData();

  // Paginated mode local state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usePagination) {
      const controller = new AbortController();
      fetchItems(controller.signal).catch((e) => {
        if (e.name !== 'AbortError') console.error(e);
      });
      return () => controller.abort();
    }
  }, [usePagination, fetchItems]);

  useEffect(() => {
    if (!usePagination) return;
    const controller = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/items?paginate=true&page=${page}&limit=${limit}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch paginated items');
        const json = await res.json();
        setData(json.data || []);
        setPages(json.pages || 1);
        setTotal(json.total || 0);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [usePagination, page, limit]);

  const list = usePagination ? data : items;
  const isLoading = usePagination ? loading : !items.length && !usePagination;
  const showPager = usePagination && pages > 1;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{color:'crimson'}}>Error: {error}</p>;

  return (
    <div style={{padding: 16}}>
      {usePagination && (
        <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <span>Page {page} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
          <label style={{marginLeft:12}}>Per page:{' '}
            <select value={limit} onChange={(e)=>{ setPage(1); setLimit(parseInt(e.target.value,10)); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
          <span style={{marginLeft:8}}>Total: {total}</span>
        </div>
      )}
      <ul>
        {list.map(item => (
          <li key={item.id}>
            <Link to={'/items/' + item.id}>{item.name}</Link>
          </li>
        ))}
      </ul>
      {showPager && (
        <div style={{display:'flex', gap:8, alignItems:'center', marginTop:12}}>
          <button onClick={() => setPage(1)} disabled={page === 1}>First</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
          <button onClick={() => setPage(pages)} disabled={page === pages}>Last</button>
        </div>
      )}
    </div>
  );
}

export default Items;
