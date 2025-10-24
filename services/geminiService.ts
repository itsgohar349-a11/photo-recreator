import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedImage } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder check. The actual API key is injected by the environment.
  console.warn("API_KEY is not set. Please ensure it is configured in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const POSES_CONFIG = [
    { label: 'Confident Pose', prompt: 'a confident pose, looking directly at the camera' },
    { label: 'Candid Laugh', prompt: 'a candid laughing pose, looking slightly away from the camera' },
    { label: 'Thoughtful Profile', prompt: 'a thoughtful three-quarters profile shot, with a soft expression' },
    { label: 'Dynamic Action', prompt: 'a dynamic action pose, as if captured mid-movement' }
];

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const generateImageForPose = async (
    base64Image: string,
    mimeType: string,
    userPrompt: string,
    posePrompt: string
): Promise<string> => {
    const defaultPrompt = "A natural, professionally shot portrait with creative lighting and a realistic, softly blurred background.";
    const finalUserPrompt = userPrompt.trim() === '' ? defaultPrompt : userPrompt;

    // A completely new prompt structure that provides a pseudo-algorithm for the model.
    const fullPrompt = `**MANDATORY RULE: The person's face in the output image MUST be identical to the face in the provided photo. Do not alter their facial features, structure, or identity in any way.**

Your task is to place the person from the photo into a new scene, with a new pose, while strictly preserving their facial identity. Follow these steps:

1.  **Analyze the Face:** First, carefully analyze the person's exact facial features from the provided image. This is your identity reference.
2.  **Create New Pose:** Re-create the person's body in a new pose described as: "${posePrompt}".
3.  **Apply Original Face:** Using the identity reference from step 1, apply the **exact** original face to the newly posed body. It must be a perfect match.
4.  **Create New Scene:** Place this re-posed person into a new environment: "${finalUserPrompt}".
5.  **Final Polish:** Adjust lighting, shadows, and color grading to make the person look natural in the new scene. The final image must be photorealistic, cinematic, 4K quality, with a 3:4 portrait aspect ratio and soft background blur.

**ABSOLUTE FORBIDDEN ACTIONS:**
- Generating a new face that only *resembles* the original.
- Changing any facial features (eyes, nose, mouth, skin tone, etc.).
- Distorting the face or body proportions.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType,
                    },
                },
                {
                    text: fullPrompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
            return part.inlineData.data;
        }
    }
    throw new Error(`Image generation failed for pose: ${posePrompt}. The model may have refused the request.`);
};

export const generateScenes = async (
    base64Image: string,
    mimeType: string,
    userPrompt: string
): Promise<GeneratedImage[]> => {
    const generationPromises = POSES_CONFIG.map(config => 
        generateImageForPose(base64Image, mimeType, userPrompt, config.prompt)
    );

    const base64Results = await Promise.all(generationPromises);

    return base64Results.map((base64, index) => ({
        src: `data:${mimeType};base64,${base64}`,
        pose: POSES_CONFIG[index].label,
    }));
};