import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId, completed } = await req.json();

    if (!moduleId || completed === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId: moduleId,
        },
      },
      update: {
        completed: completed,
      },
      create: {
        userId: session.user.id,
        moduleId: moduleId,
        completed: completed,
      },
    });

    return NextResponse.json({ message: "Progress updated", progress }, { status: 200 });
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
