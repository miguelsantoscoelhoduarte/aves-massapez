import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🦜 Exotic Birds Shop
              </h1>
            </div>
            <nav>
              <ul className="flex space-x-8">
                <li><a href="#home" className="text-gray-600 hover:text-gray-900">Home</a></li>
                <li><a href="#birds" className="text-gray-600 hover:text-gray-900">Birds</a></li>
                <li><a href="#supplies" className="text-gray-600 hover:text-gray-900">Supplies</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to the World of Exotic Birds
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover our premium collection of exotic birds and everything you need to care for your feathered friends.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
            Shop Now
          </button>
        </div>

        {/* Featured Birds */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Birds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "African Grey Parrot",
                price: "$1,200",
                description: "Highly intelligent and social companion bird",
                emoji: "🦜"
              },
              {
                name: "Blue Macaw",
                price: "$2,500",
                description: "Stunning blue feathers with incredible wingspan",
                emoji: "🦅"
              },
              {
                name: "Cockatiel",
                price: "$150",
                description: "Charming crest and friendly personality",
                emoji: "🐦"
              }
            ].map((bird, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
                <div className="text-6xl text-center mb-4">{bird.emoji}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{bird.name}</h4>
                <p className="text-gray-600 mb-4">{bird.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">{bird.price}</span>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h4>
                <p className="text-gray-600">Only the healthiest and most well-cared-for birds</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Safe Delivery</h4>
                <p className="text-gray-600">Secure and comfortable transportation for your new friend</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Expert Support</h4>
                <p className="text-gray-600">Lifetime support and guidance for bird care</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Exotic Birds Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;