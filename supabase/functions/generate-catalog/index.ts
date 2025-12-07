import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Placeholder images for catalog pages (will be replaced with AI-generated images later)
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
];

// Sample product data for placeholders
const SAMPLE_PRODUCTS = [
  { name: "Flowing Silk Midi Skirt", price: "$129", originalPrice: "$159", category: "SKIRTS" },
  { name: "Tailored Wide-Leg Trousers", price: "$149", category: "PANTS" },
  { name: "High-Waist Pleated Culottes", price: "$99", originalPrice: "$129", category: "PANTS" },
  { name: "Elegant A-Line Dress", price: "$189", category: "DRESSES" },
  { name: "Classic Straight-Leg Jeans", price: "$79", category: "DENIM" },
  { name: "Relaxed Linen Palazzo Pants", price: "$119", category: "PANTS" },
];

const FIT_NOTES = [
  "This fits well for your height and proportions.",
  "The relaxed fit complements your body measurements perfectly.",
  "Based on your measurements, we recommend sizing up for a looser fit.",
  "This style accentuates your waist beautifully.",
  "The length is ideal for your height.",
  "A versatile piece that works great with your body type.",
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, theme = "classic" } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating catalog for user: ${userId}, theme: ${theme}`);

    // Generate placeholder catalog pages
    const pages = SAMPLE_PRODUCTS.map((product, index) => ({
      imageUrl: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
      productName: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      sizes: ["XS", "S", "M", "L", "XL"],
      fitNote: FIT_NOTES[index % FIT_NOTES.length],
    }));

    // Use first image as hero
    const heroImageUrl = pages[0].imageUrl;

    // Insert catalog into database
    const { data: catalog, error: insertError } = await supabase
      .from("catalogs")
      .insert({
        user_id: userId,
        theme,
        hero_image_url: heroImageUrl,
        pages,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting catalog:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create catalog", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Catalog created successfully: ${catalog.id}`);

    const response = {
      catalogId: catalog.id,
      catalogUrl: `/catalog/${catalog.id}`,
      heroImageUrl,
      pages,
      theme,
      createdAt: catalog.created_at,
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-catalog:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
