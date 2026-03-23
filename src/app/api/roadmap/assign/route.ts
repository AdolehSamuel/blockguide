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

    const { interest } = await req.json();

    let roadmapTitle = "Blockchain Basics";
    let description = "Learn the core concepts of blockchain, decentralization, and consensus mechanisms.";
    let modulesData = [
      { title: "Introduction to Blockchain", content: "What is a blockchain?", order: 1 },
      { title: "Decentralization", content: "Why peer-to-peer matters.", order: 2 },
    ];

    if (interest === "Coding") {
      roadmapTitle = "Smart Contract Developer";
      description = "Learn Solidity and how to build decentralized applications (dApps).";
      modulesData = [
        { title: "Solidity 101", content: "Basics of Solidity.", order: 1 },
        { title: "Building a dApp", content: "Connecting frontend to smart contracts.", order: 2 },
      ];
    } else if (interest === "DeFi") {
      roadmapTitle = "DeFi Enthusiast";
      description = "Understand Decentralized Finance, liquidity pools, and tokens.";
      modulesData = [
        { title: "What is DeFi?", content: "Introduction to decentralized finance.", order: 1 },
        { title: "Liquidity Pools", content: "How AMMs work.", order: 2 },
      ];
    }

    // Try finding the roadmap first, create if doesn't exist
    let roadmap = await prisma.roadmap.findFirst({
      where: { title: roadmapTitle },
    });

    if (!roadmap) {
      roadmap = await prisma.roadmap.create({
        data: {
          title: roadmapTitle,
          description: description,
          modules: {
            create: modulesData,
          },
        },
      });
    }

    // Assign roadmap to user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { assignedRoadmapId: roadmap.id },
    });

    return NextResponse.json({ message: "Roadmap assigned", roadmapId: roadmap.id }, { status: 200 });
  } catch (error) {
    console.error("Assign roadmap error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
