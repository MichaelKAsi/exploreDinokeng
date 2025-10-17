import { useState } from 'react';
import { Mountain, ShoppingBag, Map, Bike, UtensilsCrossed, Sparkles, ArrowDown } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowToast(true);
      setEmail('');
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const scrollToOffers = () => {
    document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center text-white px-6 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            Explore Your Surroundings<br />in Dinokeng
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-stone-100 max-w-2xl mx-auto font-light">
            Adventure, relaxation, and discovery await — right at your doorstep.
          </p>
          <button
            onClick={scrollToOffers}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-10 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
          >
            Start Exploring
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
              Our Walking, Running Trail
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Say hi to our friendly wild and domestic family on the farm upclose and personal.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://bentlys.co.za/wp-content/uploads/2025/10/Bentlys-Masterplan-draft-scaled.png"
              alt="Walking Trail Map"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section id="offers" className="py-20 px-6 bg-emerald-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
            Get 10% Off Your Next Adventure
          </h2>
          <p className="text-lg text-stone-600 mb-8">
            Sign up and receive your exclusive coupon instantly.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-stone-500 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>

        {showToast && (
          <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-slideInRight">
            <p className="font-semibold">Your 10% coupon is on its way!</p>
          </div>
        )}
      </section>

      <section className="py-20 px-6 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-800 text-center mb-16">
            Discover Local Experiences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mountain className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Walking Trail</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Reconnect with nature along scenic walking routes through the Dinokeng landscape.
                </p>
                <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group">
                  Explore Trail
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">On-Site Store</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Shop local produce, souvenirs, and everyday essentials without leaving the property.
                </p>
                <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group">
                  Visit Store
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Map className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Nearby Activities</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Explore guided game drives, adventure spots, and must-see local experiences.
                </p>
                <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group">
                  See Activities
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Bike className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Bike Hire</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Hire a bike and explore the property at your own pace — perfect for couples or families.
                </p>
                <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group">
                  Rent a Bike
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Picnic Packages</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Enjoy ready-made picnic setups with local snacks, drinks, and scenic spots to relax.
                </p>
                <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group">
                  View Packages
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Mobile SPA</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Unwind with a professional spa treatment brought right to your cabin or deck.
                </p>
                <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group">
                  Book Now
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-stone-800 text-stone-300 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-serif mb-2">Dinokeng Nature Reserve</p>
          <p className="text-sm">Where adventure meets tranquility</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
