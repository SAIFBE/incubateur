import { useState } from 'react';
import { X } from 'lucide-react';
import './events.css';

export default function EventGallery({ images }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <>
            <div className="event-gallery">
                {images.slice(0, 3).map((img, idx) => (
                    <div 
                        key={idx} 
                        className="event-gallery__item"
                        onClick={() => setSelectedImage(img)}
                    >
                        <img 
                            src={img} 
                            alt="" 
                            className="event-gallery__img" 
                            loading="lazy"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="lightbox" onClick={() => setSelectedImage(null)}>
                    <button className="lightbox__close" onClick={() => setSelectedImage(null)}>
                        <X size={24} />
                    </button>
                    <img src={selectedImage} alt="Enlarged event" className="lightbox__img" />
                </div>
            )}
        </>
    );
}
