const Gemini_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const generateGeminiResponse = async ({ prompt, apikey, user }) => {
  try {
    if (!apikey) {
      throw new Error("Gemini ApiKey missing");
    }

    const response = await fetch(Gemini_Url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apikey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();

      if (response.status === 400 || response.status === 401) {
        if (user.geminiStatus !== "invalid") {
          user.geminiStatus = "invalid";
          await user.save();
        }
      }

      if (response.status === 429) {
        if (user.geminiStatus !== "quota_exceeded") {
          user.geminiStatus = "quota_exceeded";
          await user.save();
        }
      }

      throw new Error(err);
    }

    if (user.geminiStatus !== "active") {
      user.geminiStatus = "active";
      await user.save();
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text returned");
    }

    return text.trim();
  } catch (error) {
    console.log("Gemini Fetch error:", error.message);
    throw error;
  }
};