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
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8">Discover Rare Wines</h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Explore our curated collection of vintage wines from trusted sellers. Find your perfect bottle or sell your own.
      </p>
      <div className="flex justify-center gap-4 mb-12">
        <Link href="/catalogue">
          <button className="btn-primary">Shop Now</button>
        </Link>
        <Link href="/sell">
          <button className="btn-primary">Sell Your Wine</button>
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-6">Featured Bottles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredBottles.map((bottle) => (
          <div key={bottle.id} className="product-card">
            <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">Image Coming Soon</span>
            </div>
            <h3>{bottle.domaine}</h3>
            <p>{bottle.appellation} {bottle.millesime}</p>
            <p>{bottle.type} - {bottle.contenance}</p>
            <p>Quantity: {bottle.quantite}</p>
            <Link href={`/catalogue?bottle=${bottle.cle}`}>
              <button className="btn-secondary mt-4 w-full">View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
