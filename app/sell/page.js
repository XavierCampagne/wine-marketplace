'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Sell() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    localite: '',
    region: '',
    type: '',
    appellation: '',
    domaine: '',
    millesime: '',
    contenance: '',
    quantite: 1,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please log in to submit a sell request.');
      return;
    }
    const { error } = await supabase.from('sell_requests').insert({
      user_id: user.id,
      localite: formData.localite,
      region: formData.region,
      type: formData.type,
      appellation: formData.appellation,
      domaine: formData.domaine,
      millesime: formData.millesime || 'Unknown',
      contenance: formData.contenance,
      quantite: parseInt(formData.quantite) || 1,
      status: 'pending',
    });
    if (error) {
      setMessage('Error submitting request: ' + error.message);
    } else {
      setMessage('Sell request submitted successfully! We will review it soon.');
      setFormData({
        localite: '',
        region: '',
        type: '',
        appellation: '',
        domaine: '',
        millesime: '',
        contenance: '',
        quantite: 1,
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sell Your Wine</h1>
      <p className="text-gray-400 mb-6">
        Fill out the form below to submit your wine bottle for sale. Our team will review and approve listings.
      </p>
      {message && <p className="mb-4 text-red-400">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <input
          name="localite"
          value={formData.localite}
          onChange={handleChange}
          placeholder="Localité (e.g., Bordeaux)"
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
          required
        />
        <input
          name="region"
          value={formData.region}
          onChange={handleChange}
          placeholder="Région (e.g., Nouvelle-Aquitaine)"
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
          required
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
          required
        >
          <option value="">Select Type</option>
          <option value="Rouge">Rouge</option>
          <option value="Blanc">Blanc</option>
          <option value="Rosé">Rosé</option>
        </select>
        <input
          name="appellation"
          value={formData.appellation}
          onChange={handleChange}
          placeholder="Appellation (e.g., Saint-Emilion)"
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
          required
        />
        <input
          name="domaine"
          value={formData.domaine}
          onChange={handleChange}
          placeholder="Domaine (e.g., Chateau La Fagnouse)"
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
          required
        />
        <input
          name="millesime"
          value={formData.millesime}
          onChange={handleChange}
          placeholder="Vintage (e.g., 2009)"
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
        />
        <input
          name="contenance"
          value={formData.contenance}
          onChange={handleChange}
          placeholder="Contenance (e.g., 75cl)"
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
          required
        />
        <input
          name="quantite"
          type="number"
          value={formData.quantite}
          onChange={handleChange}
          placeholder="Quantity"
          min="1"
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
          required
        />
        <button
          type="submit"
          className="btn-primary col-span-full"
        >
          Submit Sell Request
        </button>
      </form>
    </div>
  );
}