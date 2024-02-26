// src/components/SearchBar.tsx
import React, { useState, useEffect } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [supernovae, setSupernovae] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSupernovae = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/search?query=${query}`);
        const data = await response.json();
        setSupernovae(data);
      } catch (error) {
        console.error('Failed to fetch supernovae', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSupernovae();
    }, 500); // Delay fetching to reduce number of requests

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search Supernovae..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <div>Loading...</div>}
      <ul>
        {supernovae.map((sn: { sn_id: string, sn_name: string }) => (
          <li key={sn.sn_id}>{sn.sn_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
