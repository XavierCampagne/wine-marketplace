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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Wine Catalogue</h1>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          name="region"
          value={filters.region}
          onChange={handleFilterChange}
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
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
        in
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
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
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
        />
        <input
          name="appellation"
          value={filters.appellation}
          onChange={handleFilterChange}
          placeholder="Appellation (e.g., Saint-Emilion)"
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wines.map((wine) => (
          <div key={wine.id} className="product-card">
            <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">Image Coming Soon</span>
            </div>
            <h3>{wine.domaine}</h3>
            <p>{wine.appellation} {wine.millesime}</p>
            <p>{wine.type} - {wine.contenance}</p>
            <p>Quantity: {wine.quantite}</p>
            <Link href={`/catalogue?bottle=${wine.cle}`}>
              <button className="btn-secondary mt-4 w-full">View Details</button>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-400">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={wines.length < itemsPerPage}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
