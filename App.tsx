
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ImageGrid } from './components/ImageGrid';
import { Loader } from './components/Loader';
import { Footer } from './components/Footer';
import { fileToBase64, generateScenes } from './services/geminiService';
import type { GeneratedImage } from './types';

const App: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<{ file: File; previewUrl: string } | null>(null);
    const [prompt, setPrompt] = useState('');
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (file: File) => {
        if (sourceImage?.previewUrl) {
            URL.revokeObjectURL(sourceImage.previewUrl);
        }
        setSourceImage({ file, previewUrl: URL.createObjectURL(file) });
        setGeneratedImages([]);
        setError(null);
    };

    const handleGenerate = useCallback(async () => {
        if (!sourceImage) {
            setError('Please upload an image first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const base64Image = await fileToBase64(sourceImage.file);
            const results = await generateScenes(base64Image, sourceImage.file.type, prompt);
            setGeneratedImages(results);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate images. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [sourceImage, prompt]);

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col antialiased">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
                        Upload a photo, describe a scene, and let AI create a professional photoshoot. Leave the description blank for creative portraits.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <ImageUploader onImageSelect={handleImageSelect} sourceImagePreview={sourceImage?.previewUrl ?? null} />
                        <PromptInput prompt={prompt} setPrompt={setPrompt} disabled={isLoading} />
                    </div>

                    <div className="text-center mb-8">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !sourceImage}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg shadow-purple-500/20"
                        >
                            {isLoading ? 'Generating...' : '✨ Generate Photoshoot'}
                        </button>
                    </div>
                    
                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center my-4">
                            <p><strong>Oops!</strong> {error}</p>
                        </div>
                    )}

                    {isLoading && <Loader />}

                    {!isLoading && generatedImages.length > 0 && (
                        <ImageGrid images={generatedImages} />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
