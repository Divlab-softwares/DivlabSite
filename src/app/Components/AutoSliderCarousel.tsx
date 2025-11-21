import React, { useEffect, useState } from 'react';

interface CarouselProps {
    images: string[];
    interval?: number; // in milliseconds
    className?: string;
}

const AutoSliderCarousel: React.FC<CarouselProps> = ({ images, interval = 3000, className }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    return (
        <div className={`relative w-full max-w-xl mx-auto overflow-hidden shadow-lg  ${className}`}>
            {/* Image container */}
            <div
                className="flex  transition-transform duration-700 ease-in-out relative"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Slide ${index + 1}`}
                        className={` w-full flex-shrink-0 object-cover `}
                    />



                ))}


            </div>

            {/* Dots navigation */}
            <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        className={`h-3 w-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-400'
                            }`}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
            <div className=' w-full  transform transition-transform duration-300 top-0 h-full pointer_event_none  absolute shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]  border rounded-3xl border-[rgba(0,200,255,0.6)]'>

            </div>
        </div>
    );
};

export default AutoSliderCarousel;