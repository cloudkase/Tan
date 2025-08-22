import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Items({ usePagination = true, showPager = true }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`/api/items?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      });
  }, [page, limit]);

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <nav style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Items</Link>
      </nav>
      <div style={{ padding: 16 }}>
        {usePagination && (
          <nav aria-label="pagination top"
               style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    aria-label="Previous page (top)">Prev</button>
            <span>Page {page} / {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page >= pages}
                    aria-label="Next page (top)">Next</button>
            <label style={{marginLeft:12}}>Per page:{' '}
              <select value={limit} onChange={(e)=>{ setPage(1); setLimit(parseInt(e.target.value,10)); }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>
            <span style={{marginLeft:8}}>Total: {total}</span>
          </nav>
        )}
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              <Link to={`/items/${it.id}`}>{it.name}</Link>
            </li>
          ))}
        </ul>
        {showPager && (
          <nav aria-label="pagination bottom"
               style={{display:'flex', gap:8, alignItems:'center', marginTop:12}}>
            <button onClick={() => setPage(1)} disabled={page === 1}
                    aria-label="First page (bottom)">First</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    aria-label="Previous page (bottom)">Prev</button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}
                    aria-label="Next page (bottom)">Next</button>
            <button onClick={() => setPage(pages)} disabled={page === pages}
                    aria-label="Last page (bottom)">Last</button>
          </nav>
        )}
      </div>
    </div>
  );
}
