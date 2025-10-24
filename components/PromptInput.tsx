
import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, disabled }) => {
    return (
        <div className="flex flex-col h-full">
            <label htmlFor="prompt" className="mb-2 font-semibold text-gray-300">Describe the New Scene</label>
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={disabled}
                placeholder="e.g., 'posing like a superhero on a city rooftop at night' or 'walking in a sunset field of flowers'."
                className="flex-grow w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder-gray-500 resize-none transition-colors disabled:bg-gray-700"
                rows={8}
            />
        </div>
    );
};
