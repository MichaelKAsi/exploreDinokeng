import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  description: string;
  backgroundImage: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

interface HeroCarouselProps {
  slides: Slide[];
  onExploreClick?: () => void;
}

export function HeroCarousel({ slides, onExploreClick }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section
      id="hero"
      className="relative aspect-square md:h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('${slide.backgroundImage}')`,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center text-white px-6 animate-fadeIn flex flex-col items-center justify-center">
        {slide.title && (
          <h1 className="text-3xl md:text-7xl font-serif mb-6 leading-tight">
            {slide.title}
          </h1>
        )}
        <button
          onClick={onExploreClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-10 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
        >
          {slide.buttonText || 'Start Exploring'}
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-8 h-3'
                : 'bg-white/50 hover:bg-white/75 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
