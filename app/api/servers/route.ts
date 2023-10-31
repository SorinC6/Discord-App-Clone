import { NextResponse } from "next/server";
import { currentProfile } from "../../../lib/current-profile";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile: any = await currentProfile();

    console.log("profile", profile);

    if (!profile) {
      return new NextResponse("Unexpected profile error", { status: 500 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ role: MemberRole.ADMIN, profileId: profile.id }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}
