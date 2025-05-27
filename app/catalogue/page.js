'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function Catalogue() {
  const [wines, setWines] = useState([]);
  const [filters, setFilters] = useState({
    region: '',
    type: '',
    millesime: '',
    appellation: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchWines = async () => {
      let query = supabase.from('wines').select('*');
      if (filters.region) query = query.eq('region', filters.region);
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.millesime) query = query.eq('millesime', filters.millesime);
      if (filters.appellation) query = query.ilike('appellation', `%${filters.appellation}%`);
      query = query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      const { data, error } = await query;
      if (error) console.error(error);
      else setWines(data);
    };
    fetchWines();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Wine Catalogue</h1>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          name="region"
          value={filters.region}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Regions</option>
          <option value="Bourgogne">Bourgogne</option>
          <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
          <option value="Loire">Loire</option>
          <option value="Sud-Ouest">Sud-Ouest</option>
          <option value="Rhône">Rhône</option>
          <option value="Provence">Provence</option>
          <option value="Alsace">Alsace</option>
          <option value="Beaujolais">Beaujolais</option>
          <option value="Jura">Jura</option>
        </select>
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="Rouge">Rouge</option>
          <option value="Blanc">Blanc</option>
          <option value="Rosé">Rosé</option>
        </select>
        <input
          name="millesime"
          value={filters.millesime}
          onChange={handleFilterChange}
          placeholder="Vintage (e.g., 2009)"
          className="border p-2 rounded"
        />
        <input
          name="appellation"
          value={filters.appellation}
          onChange={handleFilterChange}
          placeholder="Appellation (e.g., Saint-Emilion)"
          className="border p-2 rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wines.map((wine) => (
          <div key={wine.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{wine.domaine}</h3>
            <p>{wine.appellation} {wine.millesime}</p>
            <p>{wine.type} - {wine.contenance}</p>
            <p>Quantity: {wine.quantite}</p>
            <Link href={`/catalogue?bottle=${wine.cle}`}>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={wines.length < itemsPerPage}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}