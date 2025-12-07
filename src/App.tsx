import { useState } from 'react';
import { Mountain, ShoppingBag, Map, UtensilsCrossed, Sparkles, ArrowDown, Download, X } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [showPicnicModal, setShowPicnicModal] = useState(false);

  const mapUrl = 'https://bentlys.co.za/wp-content/uploads/2025/10/Bentlys-Masterplan-draft-scaled.webp';

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

  const handleDownloadMap = () => {
    const link = document.createElement('a');
    link.href = mapUrl;
    link.download = 'Bentlys-Trail-Map.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Discover Bentlys<br />Your Gateway to Dinokeng’s Best Activities
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-stone-100 max-w-2xl mx-auto font-light">
            From scenic walking trails and bike adventures to spa indulgence and picnic escapes — experience the best of nature and comfort at Bentlys.
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

          <div className="rounded-2xl overflow-hidden shadow-2xl cursor-pointer" onClick={() => setIsMapFullscreen(true)}>
            <img
              src={mapUrl}
              alt="Walking Trail Map"
              className="w-full h-auto transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleDownloadMap}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-md inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Trail Map
            </button>
          </div>
        </div>
      </section>

      {isMapFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsMapFullscreen(false)}
        >
          <button
            onClick={() => setIsMapFullscreen(false)}
            className="absolute top-6 right-6 text-white hover:text-emerald-400 transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <X className="w-10 h-10" />
          </button>
          <img
            src={mapUrl}
            alt="Walking Trail Map Fullscreen"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <section id="offers" className="py-20 px-6 bg-emerald-50 hidden">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
            Get 10% Off from our Store
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
            We respect your privacy.
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
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://bentlys.co.za/wp-content/uploads/2025/10/IMG_3786.webp?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mountain className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Walking Trail</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Reconnect with nature at Bentlys, where trails wind through the Dinokeng bush.
                </p>
                <button
                  onClick={() => setIsMapFullscreen(true)}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group"
                >
                  Explore Trail
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://bentlys.co.za/wp-content/uploads/2025/10/IMG_1192-scaled-e1760778646176.webp?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">On-Site Store</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Shop local produce, souvenirs, and everyday essentials without leaving the property.
                </p>
                <a
                  href="https://shop-bentlys.netlify.app/"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group"
                >
                  Shop Now
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://lionandcheetahsanctuary.co.za/wp-content/uploads/2015/09/DSCN7449.jpg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Map className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Nearby Activities</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Explore guided game drives, adventure spots, and must-see local experiences.
                </p>
                <a
                  href="https://nearbybentlys.netlify.app"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group"
                >
                  See Activities
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Places with Restaurants</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Discover nearby restaurants in Dinokeng Reserve. Please call to book or confirm if they do walk-ins.
                </p>
                <a
                  href="https://www.dinokengreserve.co.za/dinner-bed-breakfast/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group"
                >
                  Explore Dining
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/3408356/pexels-photo-3408356.jpeg?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Shops Nearby</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Pop by nearby shops and pop-up venues in Dinokeng. Explore local retail and unique finds.
                </p>
                <div className="space-y-2">
                  <a
                    href="https://maps.app.goo.gl/EGR8oSUoXQUd1oWc8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group text-sm"
                  >
                    Shop 1
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <br />
                  <a
                    href="https://maps.app.goo.gl/BCMWbv6Hyo8PeWPz7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group text-sm"
                  >
                    Shop 2
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <br />
                  <a
                    href="https://maps.app.goo.gl/YT6f53ojahoZZiGK6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group text-sm"
                  >
                    Shop 3
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://bentlys.co.za/wp-content/uploads/2025/10/IMG_2293.webp?auto=compress&cs=tinysrgb&w=800')` }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-serif text-stone-800">Mobile SPA</h3>
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  Unwind with a professional spa treatment brought right to your cabin or deck.
                </p>
                <a
                  href="https://wa.me/27769307944?text=I%20have%20booked%20at%20Bentlys%20and%20I%20would%20like%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-2 group"
                >
                  Book Now
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showPicnicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-3xl font-serif text-stone-800">Picnic Packages</h2>
              <button
                onClick={() => setShowPicnicModal(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-stone-600" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
                <h3 className="text-2xl font-serif text-stone-800 mb-2">Standard Picnic Package</h3>
                <p className="text-lg font-semibold text-emerald-600 mb-4">R450 per couple</p>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Picnic blanket and cushions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Selection of artisan sandwiches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Fresh fruit platter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Bottled water and juice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Sweet treats (cookies or brownies)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
                <h3 className="text-2xl font-serif text-stone-800 mb-2">Deluxe Picnic Package</h3>
                <p className="text-lg font-semibold text-amber-600 mb-4">R750 per couple</p>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Premium picnic setup with decorations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Gourmet cheese and charcuterie board</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Artisan sandwiches and wraps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Fresh fruit and vegetable platter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Sparkling wine or champagne</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Premium desserts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Personalized setup at your chosen scenic spot</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone-50 rounded-2xl p-6 border-2 border-stone-200">
                <h3 className="text-2xl font-serif text-stone-800 mb-2">Romantic Sunset Package</h3>
                <p className="text-lg font-semibold text-stone-600 mb-4">R950 per couple</p>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="text-stone-600 mt-1">•</span>
                    <span>Everything from the Deluxe Package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-600 mt-1">•</span>
                    <span>Fairy lights and candles for ambiance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-600 mt-1">•</span>
                    <span>Rose petals and romantic decorations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-600 mt-1">•</span>
                    <span>Premium wine selection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-600 mt-1">•</span>
                    <span>Bluetooth speaker for music</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-600 mt-1">•</span>
                    <span>Professional setup and cleanup service</span>
                  </li>
                </ul>
              </div>

              <div className="bg-violet-50 rounded-2xl p-6 border-2 border-violet-200">
  <h3 className="text-2xl font-serif text-stone-800 mb-2">Painting Picnic Experience</h3>
  <p className="text-lg font-semibold text-violet-600 mb-4">R850 per couple</p>
  <ul className="space-y-2 text-stone-600">
    <li className="flex items-start gap-2">
      <span className="text-violet-600 mt-1">•</span>
      <span>All-inclusive picnic setup with comfortable seating and shade</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-violet-600 mt-1">•</span>
      <span>Canvas, paint, brushes, and easels provided</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-violet-600 mt-1">•</span>
      <span>Light snacks and refreshments</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-violet-600 mt-1">•</span>
      <span>Choice between guided or self-led painting session</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-violet-600 mt-1">•</span>
      <span>Relaxed outdoor setting perfect for creativity and connection</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-violet-600 mt-1">•</span>
      <span>Take home your finished artworks</span>
    </li>
  </ul>
</div>

              
              <div className="bg-emerald-100 rounded-2xl p-6 text-center">
                <p className="text-stone-600 mb-4">
                  All packages require 24-hour advance booking
                </p>
                <a
                  href="https://wa.me/27814121666?text=Hi!%20I%27m%20interested%20in%20one%20of%20your%20picnic%20packages.%20Could%20you%20please%20share%20more%20details%3F
."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Book Your Picnic
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-stone-800 text-stone-300 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-serif mb-2">Bentlys | Dinokeng | Gauteng | Pretoria </p>
          <p className="text-sm">Nature. Leisure. Luxury</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
