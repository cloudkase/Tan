import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Detail page fetches a single item by id.
 * Uses AbortController to avoid updating state when unmounted.
 * Navigates back to list on 404 or network errors.
 */
function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch('/api/items/' + id, { signal: controller.signal });
        if (res.status === 404) {
          navigate('/');
          return;
        }
        if (!res.ok) throw new Error('Failed to load item');
        const json = await res.json();
        setItem(json);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message);
          navigate('/');
        }
      }
    })();

    return () => controller.abort();
  }, [id, navigate]);

  if (!item) return <p>Loading...</p>;

  return (
    <div style={{padding: 16}}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;
