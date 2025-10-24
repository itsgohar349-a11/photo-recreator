
import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center my-12">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            <p className="mt-4 text-gray-300">AI is working its magic...</p>
            <p className="text-sm text-gray-500">This may take a moment.</p>
        </div>
    );
};
