'use client';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { EditIcon, Hash, Lock, Mic, TrashIcon, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { cn } from '../../lib/utils';
import ActionTooltip from '../action-tooltip';
import { ModalType, useModal } from '../../hooks/use-modal-store';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-5 h-5 flex-shrik-0 text-zinc-500 dark:text-zinc-400" />,
  [ChannelType.AUDIO]: <Mic className="w-5 h-5 flex-shrik-0 text-zinc-500 dark:text-zinc-400" />,
  [ChannelType.VIDEO]: <Video className="w-5 h-5 flex-shrik-0 text-zinc-500 dark:text-zinc-400" />,
};

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/servers/${params.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      {Icon}
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 grup-hover:text-zinc-300 transition',
          params?.channelId === channel.id && 'text-primary dark:text-zinc-200'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="flex items-center ml-auto gap-x-2">
          <ActionTooltip label="Edit">
            <EditIcon
              onClick={(e) => onAction(e, 'editChannel')}
              className="hidden w-4 h-4 transition group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <TrashIcon
              onClick={(e) => onAction(e, 'deleteChannel')}
              className="hidden w-4 h-4 transition group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && <Lock className="w-4 h-4 ml-auto text-zinc-500 dark:text-zinc-400" />}
    </button>
  );
};
