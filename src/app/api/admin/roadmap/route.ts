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

    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json({ message: "Roadmap created", roadmap }, { status: 201 });
  } catch (error) {
    console.error("Create roadmap error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
