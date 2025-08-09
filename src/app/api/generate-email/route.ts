import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const emailPrompt = `
      Generate a professional email based on the following prompt: "${prompt}"
      
      Please provide:
      1. A clear and engaging subject line
      2. A well-structured email body with proper greeting, content, and closing
      3. Professional tone appropriate for business communication
      
      Return ONLY a valid JSON object with 'subject' and 'body' fields. Do not include any markdown formatting or code blocks.
      
      Example format:
      {"subject": "Your subject here", "body": "Your email body here"}
    `;

    const result = await model.generateContent(emailPrompt);
    const response = await result.response;
    let text = response.text().trim();

    // Remove markdown code block formatting if present
    text = text
      .replace(/```json\s*/, "")
      .replace(/```\s*$/, "")
      .trim();

    // Try to parse JSON response, fallback to simple format if needed
    try {
      const parsedResponse = JSON.parse(text);

      // Ensure we have subject and body fields
      if (parsedResponse.subject && parsedResponse.body) {
        return NextResponse.json({
          subject: parsedResponse.subject,
          body: parsedResponse.body,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      console.log("Failed to parse JSON, using fallback:", text);

      // If not JSON, try to extract subject and body manually
      const lines = text.split("\n").filter((line) => line.trim());

      // Look for subject in various formats
      let subject = "Professional Email";
      let bodyStartIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (line.includes("subject:") || line.includes('"subject"')) {
          subject = lines[i]
            .replace(/.*subject[:"]\s*/i, "")
            .replace(/[",]/g, "")
            .trim();
          bodyStartIndex = i + 1;
          break;
        }
      }

      // Get the body (everything after subject or the entire text)
      const bodyLines = lines.slice(bodyStartIndex);
      let body = bodyLines.join("\n").trim();

      // Clean up body if it contains JSON artifacts
      body = body
        .replace(/.*"body":\s*"/i, "")
        .replace(/"\s*}?\s*$/, "")
        .replace(/\\n/g, "\n")
        .trim();

      // If body is still empty, use the original text
      if (!body) {
        body = text;
      }

      return NextResponse.json({
        subject,
        body,
      });
    }
  } catch (error) {
    console.error("Error generating email:", error);

    // If it's a quota/rate limit error, provide a helpful fallback
    if (error instanceof Error && error.message.includes("quota")) {
      return NextResponse.json({
        subject: `Professional Email: ${prompt.toString().slice(0, 50)}...`,
        body: `Dear [Recipient Name],

I hope this email finds you well.

Regarding: ${prompt}

I wanted to reach out to discuss this matter with you. This is an important topic that requires your attention and input.

Please let me know your thoughts and if you would like to schedule a meeting to discuss this further.

Best regards,
[Your Name]
[Your Title]
[Your Contact Information]

---
Note: This is a fallback email template. Please configure your Gemini API key for AI-generated content.`,
      });
    }

    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 }
    );
  }
}
