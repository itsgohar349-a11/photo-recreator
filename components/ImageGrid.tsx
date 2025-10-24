import React from 'react';
import type { GeneratedImage } from '../types';

interface ImageGridProps {
    images: GeneratedImage[];
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


export const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
    
    const handleDownload = (src: string, pose: string) => {
        const link = document.createElement('a');
        link.href = src;
        const fileName = `photoshoot-${pose.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Your Photoshoot Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {images.map((image, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg shadow-black/30 transform hover:-translate-y-2 transition-transform duration-300">
                        <img src={image.src} alt={`Generated image of ${image.pose}`} className="w-full h-auto object-cover aspect-[3/4]" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between">
                            <p className="text-white text-sm font-medium capitalize pl-1">{image.pose}</p>
                            <button
                                onClick={() => handleDownload(image.src, image.pose)}
                                className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label={`Download image with ${image.pose}`}
                            >
                                <DownloadIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};