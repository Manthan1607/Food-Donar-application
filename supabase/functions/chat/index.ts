import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = `You are an advanced AI food assistant for "From Excess to Everyone", a food donation platform that reduces food waste and hunger.

You help users with:
- How to donate food effectively and safely
- Finding nearby NGOs and shelters
- Food safety, storage tips, and expiry guidelines
- Understanding food spoilage prediction based on food type, temperature, and time
- Smart matching: recommending which NGOs or shelters need specific food types
- Best practices for food packaging and transport
- Food waste statistics and environmental impact data
- Volunteering opportunities and logistics
- Nutrition information and meal planning from surplus food

SPECIAL CAPABILITIES:
1. SPOILAGE PREDICTION: When asked about food shelf life, provide specific timeframes based on food type (cooked rice: 4-6hrs at room temp, dal: 6-8hrs refrigerated, bread: 3-5 days, etc.)
2. SMART MATCHING: Suggest optimal donation routing based on food type, quantity, and urgency
3. IMPACT CALCULATION: Help users understand their environmental impact (1 meal saved ≈ 0.35kg food, 0.87kg CO₂ reduced)
4. FOOD SAFETY ALERTS: Proactively warn about unsafe food handling practices

Be warm, encouraging, and concise. Use emojis occasionally. Support English, Hindi, and Marathi - respond in the language the user writes in.
Keep responses brief (2-4 sentences) unless the user asks for detail.`;

    if (mode === "spoilage") {
      systemPrompt += "\n\nThe user is asking specifically about food spoilage prediction. Provide detailed, scientific-backed information about food shelf life, storage conditions, and safety indicators. Include specific timeframes.";
    } else if (mode === "matching") {
      systemPrompt += "\n\nThe user is asking about donation matching. Help them understand which NGOs or communities would benefit most from their specific food type and quantity. Consider urgency, distance, and nutritional needs.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
