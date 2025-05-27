export default function About() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-200">Our Mission</h2>
        <p className="text-gray-400">
          We are a marketplace for second-hand wine bottles, connecting collectors and enthusiasts with rare and vintage wines. Our platform ensures trust, quality, and compliance with alcohol regulations.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-200">Legal Mentions</h2>
        <p className="text-gray-400">
          Wine Marketplace is a registered business compliant with alcohol sale regulations. All users must be 21 or older. Shipping restrictions apply based on regional laws.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2 text-gray-200">Contact Us</h2>
        <p className="text-gray-400">
          Email: support@winemarketplace.com<br />
          Phone: +1-800-WINE-SHOP<br />
          Address: 123 Vintage Lane, Bordeaux, France
        </p>
      </section>
    </div>
  );
}
