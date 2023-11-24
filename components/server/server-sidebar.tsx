import React from 'react';
import { currentProfile } from '../../lib/current-profile';
import { db } from '../../lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { ServerHeader } from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import { ServerSearch } from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';

const iconMap = {
  [ChannelType.TEXT]: <Hash className="h-4 mr-2 2-4" />,
  [ChannelType.AUDIO]: <Mic className="h-4 mr-2 2-4" />,
  [ChannelType.VIDEO]: <Video className="h-4 mr-2 2-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();

  if (!profile) return null;

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  const textChannels = server?.channels.filter((ch) => ch.type === ChannelType.TEXT);

  const audioChannels = server?.channels.filter((ch) => ch.type === ChannelType.AUDIO);

  const videoChannels = server?.channels.filter((ch) => ch.type === ChannelType.VIDEO);
  const members = server?.members.filter((member) => member.profileId !== profile.id);

  if (!server) {
    return redirect('/');
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type] || null,
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members Channels',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection sectionType="channels" channelType={ChannelType.TEXT} role={role} label="Text Channels" />
            {textChannels.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
