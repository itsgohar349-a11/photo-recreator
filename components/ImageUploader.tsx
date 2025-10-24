
import React, { useRef } from 'react';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    sourceImagePreview: string | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, sourceImagePreview }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            className="flex flex-col items-center justify-center bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg p-6 h-full min-h-[250px] md:min-h-full cursor-pointer hover:border-purple-500 transition-colors duration-300" 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                aria-label="Upload image"
            />
            {sourceImagePreview ? (
                <div className="relative w-full h-full max-h-96">
                    <img src={sourceImagePreview} alt="Uploaded preview" className="w-full h-full object-contain rounded-md" />
                     <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md">
                        <p className="text-white font-semibold text-center">Click to change image</p>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <UploadIcon />
                    <p className="mt-2 text-sm text-gray-400">
                        <span className="font-semibold text-purple-400">Click to upload</span> a person's photo
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                </div>
            )}
        </div>
    );
};
