import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateGeminiResponse } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    let convId = conversationId;

    if (!convId) {
      // Create new conversation
      const conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: "BlockGuide Chat", // A more advanced system might summarize the first prompt to generate title
        },
      });
      convId = conversation.id;
    } else {
      // Verify ownership
      const existingConv = await prisma.conversation.findUnique({
        where: { id: convId },
      });
      if (!existingConv || existingConv.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: convId,
        sender: "user",
        text,
      },
    });

    // Get chat history
    const pastMessages = await prisma.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "asc" },
    });

    const history = pastMessages.slice(0, -1).map((m: any) => ({
      role: m.sender === "bot" ? "model" : "user",
      parts: [{ text: m.text }],
    })) as { role: "user" | "model"; parts: { text: string }[] }[];

    const roadmaps = await prisma.roadmap.findMany({
      include: { modules: { orderBy: { order: "asc" } } }
    });

    const roadmapContext = roadmaps.map(r => 
      `Roadmap: ${r.title}\nDescription: ${r.description}\nModules: ${r.modules.map(m => m.title).join(" -> ")}`
    ).join("\n\n");

    const systemInstruction = `You are BlockGuide, an AI digital mentor for African youth learning about blockchain technology.
Keep responses concise, simple, and culturally grounded. Help them figure out learning paths regardless of constraints (like no internet access) by suggesting offline tools, community hubs, or basic conceptual study.

The user is greeted with a Main Menu on their screen:
1. Explain a blockchain concept
2. Tell me about available learning roadmaps
3. Show me basics

If the user responds with "1", "2", or "3", answer accordingly based on the menu option chosen.

Here is the current list of available Roadmaps stored in the database that you can recommend and describe in detail:
${roadmapContext ? roadmapContext : "No roadmaps currently available."}`;

    const botResponseText = await generateGeminiResponse(
      systemInstruction,
      history,
      text,
    );

    // Save bot message
    await prisma.message.create({
      data: {
        conversationId: convId,
        sender: "bot",
        text: botResponseText,
      },
    });

    return NextResponse.json(
      { text: botResponseText, conversationId: convId },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
