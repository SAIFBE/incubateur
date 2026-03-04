import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import './EventSlideshow.css';

const slides = [
    {
        image: `${import.meta.env.BASE_URL}events/event1.png`,
        title: "Innovation Workshop",
        description: "Students collaborating on innovative ideas"
    },
    {
        image: `${import.meta.env.BASE_URL}events/event2.png`,
        title: "Startup Competition",
        description: "Pitching projects to the incubator committee"
    },
    {
        image: `${import.meta.env.BASE_URL}events/event3.png`,
        title: "Tech Conference",
        description: "Learning from industry experts"
    }
];

export default function EventSlideshow() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="event-slideshow-container relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="h-full w-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ 
                                backgroundImage: `url('${slide.image}')`,
                                // Note: background-image doesn't support native loading="lazy", 
                                // but we can simulate it or ensure it's only loaded when needed.
                                // For simplicity here, we'll keep the background-image and rely on browser optimization.
                            }}
                            role="img"
                            aria-label={slide.title}
                        />
                        {/* Dark overlay gradient */}
                        <div className="absolute inset-0 slide-overlay" />

                        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-white leading-tight slide-title fade-in-up">
                                {slide.title}
                            </h1>
                            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl slide-description fade-in-up delay-100">
                                {slide.description}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-actions fade-in-up delay-200">
                                <Link to="/opportunities">
                                    <Button size="lg" className="border-white text-white hover:bg-white/20 w-full sm:w-auto hero-btn-primary">
                                        {t('home.heroCta')}
                                        <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                                    </Button>
                                </Link>
                                <Link to="/submit">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 w-full sm:w-auto">
                                        {t('home.heroCtaSecondary')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className="absolute top-1/2 left-4 -translate-y-1/2 z-30 p-2 text-white/80 hover:text-white hover:bg-black/40 bg-black/20 rounded-full transition-all nav-btn"
                onClick={isRTL ? nextSlide : prevSlide}
                aria-label="Previous Slide"
            >
                <ChevronLeft className="h-8 w-8" />
            </button>

            <button
                className="absolute top-1/2 right-4 -translate-y-1/2 z-30 p-2 text-white/80 hover:text-white hover:bg-black/40 bg-black/20 rounded-full transition-all nav-btn"
                onClick={isRTL ? prevSlide : nextSlide}
                aria-label="Next Slide"
            >
                <ChevronRight className="h-8 w-8" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${
                            index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80 w-2'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
