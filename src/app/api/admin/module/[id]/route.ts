import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.module.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Module deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete module error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
