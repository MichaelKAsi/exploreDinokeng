import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { HeroCarousel } from './components/HeroCarousel';
import { Footer } from './components/Footer';
import { supabase, Banner, ExperienceCard } from './lib/supabase';

type SiteSettings = {
  show_walking_trail: boolean;
};

// Icon mapping helper
const getIcon = (iconName: string, className?: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Mountain: LucideIcons.Mountain,
    ShoppingBag: LucideIcons.ShoppingBag,
    Map: LucideIcons.Map,
    UtensilsCrossed: LucideIcons.UtensilsCrossed,
    Sparkles: LucideIcons.Sparkles,
    Download: LucideIcons.Download,
    X: LucideIcons.X,
    Bike: LucideIcons.Bike,
    Heart: LucideIcons.Heart,
    Flame: LucideIcons.Flame,
    Coffee: LucideIcons.Coffee,
    TreePine: LucideIcons.TreePine,
    Tent: LucideIcons.Tent,
    Compass: LucideIcons.Compass,
  };

  const IconComponent = iconMap[iconName] || LucideIcons.Mountain;
  return <IconComponent className={className} />;
};

// Tailwind color class helper
const getColorClass = (color: string, type: 'text' | 'bg' | 'border' = 'text') => {
  // Colors are already in format like "emerald-600", so just prefix with type
  return `${type}-${color.split('-')[1] === '600' ? color.replace('600', type === 'text' ? '600' : '600') : color}`;
};

function App() {
  const [showToast, setShowToast] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [showFirewoodModal, setShowFirewoodModal] = useState(false);
  const [showDateNightModal, setShowDateNightModal] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cards, setCards] = useState<ExperienceCard[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ show_walking_trail: true });

  useEffect(() => {
    fetchBanners();
    fetchCards();
    fetchSettings();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .order('order', { ascending: true });

      if (data) {
        setBanners(data);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  const fetchCards = async () => {
    try {
      const { data } = await supabase
        .from('experience_cards')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });

      if (data) {
        setCards(data);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'show_walking_trail')
        .single();

      if (data) {
        setSettings({ show_walking_trail: data.setting_value === 'true' });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const mapUrl = 'https://bentlys.co.za/wp-content/uploads/2025/12/walking_trailer_map.png';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const scrollToOffers = () => {
    document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroSlides = banners.length > 0
    ? banners.map((banner) => ({
        id: banner.id as unknown as number,
        title: banner.title,
        description: '',
        backgroundImage: banner.background_image,
        buttonText: banner.button_text || undefined,
      }))
    : [
        {
          id: 1,
          title: 'Discover Bentlys\nYour Gateway to Dinokeng\'s Best Activities',
          description: 'From scenic walking trails and bike adventures to spa indulgence and picnic escapes — experience the best of nature and comfort at Bentlys.',
          backgroundImage: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1920',
          buttonText: 'Start Exploring',
        },
      ];

  const handleDownloadMap = () => {
    const link = document.createElement('a');
    link.href = mapUrl;
    link.download = 'Bentlys-Trail-Map.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDateNightOrder = () => {
    const message = `Hi! I would like to book the Date Night Package (R450). Please confirm availability. I understand that orders should be made at least 48 hours in advance.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/27814121666?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    setShowDateNightModal(false);
  };

  const handleCardClick = (card: ExperienceCard) => {
    if (card.button_action === 'modal') {
      if (card.modal_type === 'firewood') {
        setShowFirewoodModal(true);
      } else if (card.modal_type === 'date_night') {
        setShowDateNightModal(true);
      }
    } else if (card.button_action === 'fullscreen') {
      setIsMapFullscreen(true);
    }
  };

  const renderCard = (card: ExperienceCard, index: number) => {
    const isFeatured = card.is_featured;
    const isComingSoon = card.is_coming_soon;
    const hasAdditionalLinks = card.additional_links && card.additional_links.length > 0;

    const cardContent = (
      <>
        {isFeatured && card.featured_badge_text && (
          <div
            className={`absolute top-4 right-4 bg-gradient-to-r ${card.featured_gradient_from ? `from-${card.featured_gradient_from}` : 'from-rose-600'} ${card.featured_gradient_to ? `to-${card.featured_gradient_to}` : 'to-pink-600'} text-white px-4 py-1 rounded-full text-sm font-semibold`}
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-from, #e11d48), var(--tw-gradient-to, #db2777))`
            }}
          >
            {card.featured_badge_text}
          </div>
        )}
        <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('${card.image_url}')` }} />
        {isComingSoon && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <p className="text-white text-2xl font-serif font-semibold">Coming Soon</p>
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            {getIcon(card.icon, `w-6 h-6 text-${card.icon_color.split('-')[0]}-${card.icon_color.split('-')[1]}`)}
            <h3 className="text-2xl font-serif text-stone-800">{card.title}</h3>
          </div>
          <p className="text-stone-600 mb-6 leading-relaxed">
            {card.description}
          </p>

          {hasAdditionalLinks ? (
            <div className="space-y-2">
              {card.additional_links!.map((link, linkIndex) => (
                <div key={linkIndex}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-${card.icon_color.split('-')[0]}-${card.icon_color.split('-')[1]} font-semibold hover:opacity-80 transition-colors inline-flex items-center gap-2 group text-sm`}
                  >
                    {link.text}
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              ))}
            </div>
          ) : card.button_action === 'link' && card.button_url ? (
            <a
              href={card.button_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-${card.icon_color.split('-')[0]}-${card.icon_color.split('-')[1]} font-semibold hover:opacity-80 transition-colors inline-flex items-center gap-2 group`}
            >
              {card.button_text || 'Learn More'}
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
          ) : card.button_action === 'disabled' ? (
            <button
              disabled
              className="text-stone-400 font-semibold cursor-not-allowed inline-flex items-center gap-2 group"
            >
              {card.button_text || 'Coming Soon'}
              <span className="transform">→</span>
            </button>
          ) : (
            <button
              onClick={() => handleCardClick(card)}
              className={`text-${card.icon_color.split('-')[0]}-${card.icon_color.split('-')[1]} font-semibold hover:opacity-80 transition-colors inline-flex items-center gap-2 group`}
            >
              {card.button_text || 'View'}
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          )}
        </div>
      </>
    );

    if (isFeatured) {
      return (
        <div key={card.id} className="group relative bg-white rounded-2xl overflow-hidden transform hover:-translate-y-1 md:col-span-1 lg:md:col-span-1">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10`} />
          <div className="relative shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl overflow-hidden h-full border-2 border-rose-300">
            {cardContent}
          </div>
        </div>
      );
    }

    return (
      <div
        key={card.id}
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 relative"
      >
        {cardContent}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <HeroCarousel slides={heroSlides} onExploreClick={scrollToOffers} />

      {settings.show_walking_trail && (
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
                <LucideIcons.Download className="w-5 h-5" />
                Download Trail Map
              </button>
            </div>
          </div>
        </section>
      )}

      {isMapFullscreen && settings.show_walking_trail && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsMapFullscreen(false)}>
          <button
            onClick={() => setIsMapFullscreen(false)}
            className="absolute top-6 right-6 text-white hover:text-emerald-400 transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <LucideIcons.X className="w-10 h-10" />
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

      <section id="experiences" className="py-20 px-6 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-800 text-center mb-16">
            Discover Local Experiences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, index) => renderCard(card, index))}
          </div>
        </div>
      </section>

      {showFirewoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 md:p-4 bg-black/60 backdrop-blur-sm animate-modalFadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 border-b border-amber-700 px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-3xl font-serif text-white">Order Your Firewood Today!</h2>
              <button
                onClick={() => setShowFirewoodModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <LucideIcons.X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200 text-center">
                <p className="text-5xl font-serif text-amber-700 mb-2">R50/Bag</p>
                <p className="text-lg text-stone-600">Premium Firewood - Ready to Burn</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-stone-800">Order Process</h3>

                <div className="space-y-4">
                  <div className="bg-stone-50 rounded-xl p-4 border-l-4 border-amber-600">
                    <p className="text-sm font-semibold text-stone-700 mb-3">Step 1: Make Payment & Contact Us</p>
                    <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-stone-600 mb-3">
                      <p><span className="font-semibold">Bank:</span> Nedbank</p>
                      <p><span className="font-semibold">Account Holder:</span> Kiara Mayamiko (PTY) LTD</p>
                      <p><span className="font-semibold">Account Number:</span> 1292109114</p>
                      <p className="pt-2"><span className="font-semibold">Reference:</span> Your Name - Wood</p>
                    </div>
                    <p className="text-sm text-stone-600 mb-3">After payment, share your proof via WhatsApp:</p>
                    <a
                      href="https://wa.me/27814121666?text=Hi%2C%20I%20have%20made%20a%20payment%20for%20firewood%20and%20would%20like%20to%20place%20my%20order.%20Please%20find%20attached%20my%20proof%20of%20payment."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-6 py-2 transition-all duration-300 text-sm"
                    >
                      Send via WhatsApp
                    </a>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-4 border-l-4 border-amber-600">
                    <p className="text-sm font-semibold text-stone-700 mb-2">Step 2: Get Delivery</p>
                    <p className="text-sm text-stone-600">Your firewood will be delivered within <span className="font-semibold">30 minutes</span> of order confirmation.</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-100 rounded-2xl p-4 border border-amber-300">
                <p className="text-stone-700 text-sm">
                  <span className="font-semibold">Note:</span> Keep your proof of payment ready when contacting us for order confirmation.
                </p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setShowFirewoodModal(false)}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl px-6 py-3 transition-all duration-300"
                >
                  Maybe Later
                </button>
                <a
                  href="https://wa.me/27814121666?text=Hi%2C%20I%20would%20like%20to%20order%20firewood.%20How%20do%20I%20proceed%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDateNightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 md:p-4 bg-black/60 backdrop-blur-sm animate-modalFadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-rose-600 to-pink-600 border-b border-rose-700 px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-3xl font-serif text-white">Date Night Package</h2>
              <button
                onClick={() => setShowDateNightModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <LucideIcons.X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-rose-50 rounded-2xl p-6 border-2 border-rose-200 text-center">
                <p className="text-5xl font-serif text-rose-600 mb-2">R450</p>
                <p className="text-lg text-stone-600">Perfect for Couples</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <p className="text-lg font-serif text-stone-800 italic text-center">
                  "Enjoy a beautiful time with your partner and get to know each other better"
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-stone-800">What's Included:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-600 text-xl mt-0">•</span>
                    <span className="text-stone-600">Intimate couples games to spark conversation and connection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-600 text-xl mt-0">•</span>
                    <span className="text-stone-600">2 Canvas with paint supplies for creative moments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-600 text-xl mt-0">•</span>
                    <span className="text-stone-600">Microwave popcorn for cozy snacking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-600 text-xl mt-0">•</span>
                    <span className="text-stone-600">Premium wine selection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-600 text-xl mt-0">•</span>
                    <span className="text-stone-600">Snacks and Treats</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300">
                <p className="text-stone-700 text-sm">
                  <span className="font-semibold">Important:</span> Orders should be made at least 48 hours in advance to avoid disappointment.
                </p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setShowDateNightModal(false)}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl px-6 py-3 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={handleDateNightOrder}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 transform hover:scale-105"
                >
                  Order Now on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
