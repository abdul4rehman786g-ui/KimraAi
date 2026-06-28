import User from "../Models/user.model.js";
import { generateGeminiResponse } from "../Config/gemini.js";

export const getAssistantConfig = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-geminiApiKey");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "failed to get user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assistant Config data",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Assistant Config Failed ${error}`,
    });
  }
};

export const askAssistant = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ message: "Message and userId are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.geminiApiKey) {
      return res.status(400).json({ message: "Gemini API key is not added" });
    }

    if (user.totalMessages >= user.requestLimit) {
      return res.status(400).json({ message: "Free Limit reached" });
    }

    const cleanMessage = message.toLowerCase();

    if (user.enableNavigation) {
      const navPhrases = [
        "open",
        "go",
        "go to",
        "start",
        "show",
        "show me",
        "navigate",
        "navigate to",
        "take me",
        "take me to",
        "i want to see",
        "i want to go",
        "i want to open",
        "i need to see",
        "i need to go",
        "let me see",
        "let me go",
        "bring me",
        "bring me to",
        "lead me",
        "visit",
        "launch",
        "load",
        "pull up",
        "switch to",
        "jump to",
        "head to",
        "move to",
        "get me to",
        "redirect",
        "redirect me",
        "redirect to",
        "where is",
        "where can i find",
        "how do i get to",
        "can you open",
        "can you show",
        "can you take me",
      ];

      const wantsNavigation = navPhrases.some(
        (phrase) =>
          cleanMessage.startsWith(phrase) ||
          cleanMessage === phrase ||
          cleanMessage.includes(phrase + " ")
      );

      if (wantsNavigation) {
        const matchedPage = user.pages.find((page) =>
          page.keywords.some(
            (keyword) =>
              cleanMessage.includes(keyword.toLowerCase()) ||
              keyword.toLowerCase().includes(
                cleanMessage
                  .replace(
                    /open|go to|show me|navigate to|take me to|pull up|switch to|jump to/g,
                    ""
                  )
                  .trim()
              )
          )
        );

        if (matchedPage) {
          if (req.body.currentPath === matchedPage.path) {
            return res.json({
              success: true,
              response: `${matchedPage.name} is already open.`,
            });
          }

          return res.json({
            success: true,
            action: "navigate",
            path: matchedPage.path,
            response: `Opening ${matchedPage.name}...`,
          });
        }

        return res.json({
          success: true,
          response: `Sorry, I could not find that page. Try: ${user.pages
            .map((p) => p.name)
            .join(", ")}.`,
        });
      }
    }

    const prompt = `
You are a smart voice assistant for a business.

Business Name:
${user.businessName}

Business Description:
${user.businessDescription}

Assistant Tone:
${user.tone}

Rules:

- Keep replies under 15 words
- Give fast direct responses
- Talk naturally
- Behave like smart voice assistant
- Avoid long explanations
- Keep responses short for quick voice playback

User Question:
${message}
`;

    const aiResponse = await generateGeminiResponse({prompt, apikey:user.geminiApiKey, user});

    user.totalMessages += 1;
    await user.save();

    return res.json({
      success: true,
      aiResponse,
    });

  } catch (error) {
    console.log(error);
    console.log("CONTROLLER ERROR:", error.message);
    return res.status(500).json({
      message: error.message, 
      success: false,
      message: "Assistant AI Error",
    });
  }
};