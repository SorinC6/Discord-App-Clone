import { NextResponse } from "next/server";
import { currentProfile } from "../../../../../lib/current-profile";
import { db } from "../../../../../lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unexpected profile error", { status: 500 });
    }
    if (!params.serverId) {
      return new NextResponse("server id id missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER ID LEAVE ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
