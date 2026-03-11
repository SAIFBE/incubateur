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
                        className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
                        }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear scale-110 object-cover"
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
                        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent slide-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />

                        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 text-white leading-tight slide-title fade-in-up md:w-3/4">
                                {slide.title}
                            </h1>
                            <p className="text-xl sm:text-2xl text-surface-300 mb-10 max-w-2xl slide-description fade-in-up delay-100">
                                {slide.description}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 slide-actions fade-in-up delay-200">
                                <Link to="/opportunities">
                                    <button className="modern-btn modern-btn-primary w-full sm:w-auto text-lg px-8 py-4 hero-btn-primary">
                                        {t('home.heroCta')}
                                        <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                                    </button>
                                </Link>
                                <Link to="/submit">
                                    <button className="modern-btn w-full sm:w-auto text-lg px-8 py-4">
                                        {t('home.heroCtaSecondary')}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Glowing accents for the slider */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-highlight/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen z-10" />

            {/* Navigation Arrows */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute inset-0 pointer-events-none flex items-center justify-between z-30">
                <button
                    className="pointer-events-auto p-4 text-surface-400 hover:text-white bg-bg-primary/50 hover:bg-bg-primary border border-white/5 hover:border-primary-500 rounded-2xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] backdrop-blur-md nav-btn"
                    onClick={isRTL ? nextSlide : prevSlide}
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                    className="pointer-events-auto p-4 text-surface-400 hover:text-white bg-bg-primary/50 hover:bg-bg-primary border border-white/5 hover:border-primary-500 rounded-2xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] backdrop-blur-md nav-btn"
                    onClick={isRTL ? prevSlide : nextSlide}
                    aria-label="Next Slide"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            index === currentSlide ? 'bg-primary-500 w-10 h-2 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-surface-600 hover:bg-surface-400 w-2 h-2'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
