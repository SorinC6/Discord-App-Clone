'use client';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Hash, Mic, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { cn } from '../../lib/utils';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="h-4 mr-2 2-4" />,
  [ChannelType.AUDIO]: <Mic className="h-4 mr-2 2-4" />,
  [ChannelType.VIDEO]: <Video className="h-4 mr-2 2-4" />,
};

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  return <button onClick={() => {}} className={cn('group px-2 rounded-md items-center')}></button>;
};
