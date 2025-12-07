import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Base64 encode helper
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Fetch image and convert to base64 data URL
async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  console.log(`Fetching image: ${imageUrl}`);
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);
  const contentType = response.headers.get("content-type") || "image/jpeg";
  return `data:${contentType};base64,${base64}`;
}

// Extract raw base64 data from data URL
function extractBase64Data(dataUrl: string): { data: string; mimeType: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  throw new Error("Invalid data URL format");
}

// Generate virtual try-on using Google Gemini API directly
async function generateTryOn(selfieBase64: string, outfitBase64: string, apiKey: string): Promise<string | null> {
  console.log("Calling Google Gemini API for virtual try-on generation...");

  // Extract base64 data from data URLs
  const selfieData = extractBase64Data(selfieBase64);
  const outfitData = extractBase64Data(outfitBase64);

  // Detailed prompt for high-quality virtual try-on
  const prompt = `User replace the outfit on image 1 (the person with the white background) and put it on the body. Do not mix their facial features and only use the image of the person in image 2. Preserve the body proportions and facial features of person in image 1. Make sure when you place the outfit on them, the head is not disproportional to the body and make sure the body looks exactly the same, if you tend to make the bodies look bigger, make them skinnier by 20%. Produce the images in 4K. Make sure at the end to replace the background of the output image with a light gray background.
DO NOT ALTER THE FACE IN ANY WAY SHAPE OR FORM, DO NOT TOUCH UP OR CHANGE FACIAL EXPRESSIONS OR FEATURES WHATSOEVER!!!!! DO NOT CHANGE THE HAIRSTYLE OR ANY FACIAL HAIR ON THE PERSON!!!
Generate an image of the person from Image 1 wearing the outfit from Image 2.`;

  // Google Gemini API native request format
  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: selfieData.mimeType,
              data: selfieData.data,
            },
          },
          {
            inline_data: {
              mime_type: outfitData.mimeType,
              data: outfitData.data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google Gemini API error:", response.status, errorText);

    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (response.status === 403) {
      throw new Error("API key invalid or quota exceeded.");
    }
    throw new Error(`Google Gemini API error: ${errorText}`);
  }

  const data = await response.json();
  console.log("Google Gemini API response received");

  // Extract image from Google Gemini response format
  const candidates = data.candidates;
  if (candidates && candidates.length > 0) {
    const parts = candidates[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          const { mimeType, data: imageData } = part.inlineData;
          const dataUrl = `data:${mimeType};base64,${imageData}`;
          console.log("Generated image extracted successfully");
          return dataUrl;
        }
      }
    }
  }

  // Log response structure for debugging
  console.log("No image found in response. Response structure:", JSON.stringify(data, null, 2).substring(0, 500));
  return null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration is missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { selfieBase64: selfieInput, modelImageUrls, userId } = await req.json();

    if (!selfieInput) {
      throw new Error("Selfie image is required");
    }

    // Handle both base64 data and URLs - convert URL to base64 if needed
    let selfieBase64 = selfieInput;
    if (selfieInput.startsWith("http://") || selfieInput.startsWith("https://")) {
      console.log("Selfie provided as URL, converting to base64...");
      selfieBase64 = await fetchImageAsBase64(selfieInput);
    } else if (!selfieInput.startsWith("data:")) {
      throw new Error("Invalid selfie format - must be base64 data URL or HTTP URL");
    }

    if (!modelImageUrls || !Array.isArray(modelImageUrls) || modelImageUrls.length === 0) {
      throw new Error("At least one model image URL is required");
    }

    console.log(`Processing ${modelImageUrls.length} model images for user ${userId || "anonymous"}`);

    const generatedImages: string[] = [];

    // Process each model image
    for (let i = 0; i < modelImageUrls.length; i++) {
      const modelImageUrl = modelImageUrls[i];
      console.log(`Processing model image ${i + 1}/${modelImageUrls.length}`);

      try {
        // Fetch model image and convert to base64
        const modelImageBase64 = await fetchImageAsBase64(modelImageUrl);

        // Generate try-on image using Google Gemini API
        const generatedImage = await generateTryOn(selfieBase64, modelImageBase64, GOOGLE_API_KEY);

        if (generatedImage) {
          // Check if the image is already a URL or base64
          if (generatedImage.startsWith("http://") || generatedImage.startsWith("https://")) {
            // Already a URL, use directly
            generatedImages.push(generatedImage);
            console.log(`Image ${i + 1} received as URL: ${generatedImage.substring(0, 100)}...`);
          } else {
            // It's base64, upload to Supabase storage
            const base64Data = generatedImage.split(",")[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let j = 0; j < byteCharacters.length; j++) {
              byteNumbers[j] = byteCharacters.charCodeAt(j);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/png" });

            const fileName = `${userId || "anon"}/${Date.now()}_${i}_${Math.random().toString(36).substring(7)}.png`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("tryon-results")
              .upload(fileName, blob, {
                contentType: "image/png",
                upsert: false,
              });

            if (uploadError) {
              console.error("Storage upload error:", uploadError);
              // Still return the base64 image if upload fails
              generatedImages.push(generatedImage);
            } else {
              const { data: urlData } = supabase.storage.from("tryon-results").getPublicUrl(uploadData.path);
              generatedImages.push(urlData.publicUrl);
              console.log(`Image ${i + 1} uploaded successfully: ${urlData.publicUrl}`);
            }
          }
        } else {
          console.log(`No image generated for model image ${i + 1}`);
        }
      } catch (error) {
        console.error(`Error processing model image ${i + 1}:`, error);
        // Continue with remaining images
      }
    }

    if (generatedImages.length === 0) {
      throw new Error("Failed to generate any try-on images");
    }

    console.log(`Successfully generated ${generatedImages.length} try-on images`);

    return new Response(
      JSON.stringify({
        success: true,
        generatedImages,
        message: `Generated ${generatedImages.length} try-on image(s)`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Virtual try-on error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const status = errorMessage.includes("Rate limit") ? 429 : errorMessage.includes("quota") ? 403 : 500;

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
