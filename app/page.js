import Link from 'next/link';
import { supabase } from '../lib/supabase';

async function fetchFeaturedBottles() {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .order('quantite', { ascending: false })
    .limit(3);
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function Home() {
  const featuredBottles = await fetchFeaturedBottles();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to the Wine Marketplace</h1>
      <p className="text-center text-gray-700 mb-8">
        Discover rare and vintage wines from trusted sellers. Browse our catalogue or sell your own bottles.
      </p>
      <div className="flex justify-center gap-4 mb-12">
        <Link href="/catalogue">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            Shop Now
          </button>
        </Link>
        <Link href="/sell">
          <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
            Sell Your Wine
          </button>
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Featured Bottles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredBottles.map((bottle) => (
          <div key={bottle.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{bottle.domaine}</h3>
            <p>{bottle.appellation} {bottle.millesime}</p>
            <p>{bottle.type} - {bottle.contenance}</p>
            <p>Quantity: {bottle.quantite}</p>
            <Link href={`/catalogue?bottle=${bottle.cle}`}>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
