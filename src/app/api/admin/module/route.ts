import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId, title, content, order } = await req.json();

    if (!roadmapId || !title || !content || order === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newModule = await prisma.module.create({
      data: {
        roadmapId,
        title,
        content,
        order: Number(order),
      },
    });

    return NextResponse.json({ message: "Module created", module: newModule }, { status: 201 });
  } catch (error) {
    console.error("Create module error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
