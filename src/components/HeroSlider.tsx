import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Улирлын Чанартай Дугуй',
    subtitle: 'Өндөр чанар, найдвартай аюулгүй байдал',
    cta: 'Дэлгүүр үзэх',
    image: 'https://images.unsplash.com/photo-1623119963734-95a6e99ba7a1?w=1920&h=600&fit=crop'
  },
  {
    id: 2,
    title: 'Тусгай Загварын Обуд',
    subtitle: 'Дэлхийн тэргүүлэх брэндүүдийн онцгой загвар',
    cta: 'Цуглуулга үзэх',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=600&fit=crop'
  },
  {
    id: 3,
    title: 'Чанартай Эд Анги, Мэргэжлийн Үйлчилгээ',
    subtitle: 'Монгол дахь таны найдвартай автомашины түнш',
    cta: 'Дэлгэрэнгүй',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&h=600&fit=crop'
  }
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[300px] overflow-hidden sm:h-[400px] md:h-[500px] lg:h-[600px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ImageWithFallback
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="mx-auto max-w-[1400px] px-4 text-center text-white md:px-8">
              <h1 className="mb-3 text-2xl font-bold drop-shadow-lg sm:text-3xl md:mb-4 md:text-4xl lg:text-[56px]">
                {slide.title}
              </h1>
              <p className="mb-4 text-sm sm:text-base md:mb-8 md:text-lg lg:text-xl">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-[#DC2626] px-6 py-5 text-sm font-bold hover:bg-[#B91C1C] md:px-10 md:py-6 md:text-base"
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-opacity hover:bg-black/50 md:left-8 md:p-3"
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-opacity hover:bg-black/50 md:right-8 md:p-3"
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-8 md:gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all md:h-3 md:w-3 ${
              index === currentSlide
                ? 'bg-[#DC2626] w-6 md:w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}