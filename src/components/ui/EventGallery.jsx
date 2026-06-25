import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './EventGallery.css';

const eventImages = [
    'Image1.jpeg',
    'Image2.jpeg',
    'image3.jpeg',
    'image4.jpeg',
    'image5.jpeg',
    'image6.jpeg',
    'image7.jpeg'
];

export default function EventGallery() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % eventImages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % eventImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + eventImages.length) % eventImages.length);
    };

    return (
        <section className="gallery-section" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="gallery-bg-glow"></div>
            
            <div className="gallery-container">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                    {t('home.galleryTitle', 'Life at the Incubator')}
                </h2>
                <p className="text-surface-400 text-lg max-w-2xl mx-auto mb-16">
                    {t('home.gallerySub', 'Get a glimpse into our vibrant ecosystem, workshops, and networking events.')}
                </p>

                <div className="gallery-wrapper">
                    {/* Slideshow Container */}
                    <div className="gallery-slideshow">
                        {eventImages.map((img, index) => (
                            <div
                                key={index}
                                className={`gallery-slide ${index === currentSlide ? 'active' : 'inactive'}`}
                            >
                                <img
                                    src={`${import.meta.env.BASE_URL}events/${img}`}
                                    alt={`Event ${index + 1}`}
                                    className="gallery-image"
                                />
                                <div className="gallery-overlay"></div>
                            </div>
                        ))}

                        {/* Navigation Arrows */}
                        <div className="gallery-nav">
                            <button
                                className="gallery-btn"
                                onClick={isRTL ? nextSlide : prevSlide}
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                className="gallery-btn"
                                onClick={isRTL ? prevSlide : nextSlide}
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Dots */}
                        <div className="gallery-dots">
                            {eventImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`gallery-dot ${index === currentSlide ? 'active' : 'inactive'}`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
