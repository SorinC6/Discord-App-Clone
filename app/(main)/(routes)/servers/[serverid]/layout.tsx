import React from "react";
import { currentProfile } from "../../../../../lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "../../../../../lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "../../../../../components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 flex-col hidden h-full border-2 md:flex w-60">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="h-full md:pl-60">{children}</div>
    </div>
  );
};

export default ServerIdLayout;
