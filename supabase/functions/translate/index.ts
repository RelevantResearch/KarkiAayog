import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return new Response(
        JSON.stringify({ translatedText: "" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|ne`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const translatedText = data?.responseData?.translatedText || text;

    return new Response(
      JSON.stringify({ translatedText }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: "Translation failed", translatedText: "" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
