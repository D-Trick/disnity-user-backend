// entities
import { Tag } from '@databases/entities/tag.entity';
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export interface SaveValues extends Pick<Guild, 'summary' | 'content'> {
    id: string;
    serverOpen: 'public' | 'private';
    categoryId: number;
    linkType: 'invite' | 'membership';
    inviteAuto: 'auto' | 'manual';
    inviteCode: string;
    channelId: string;
    membershipUrl: string;
    tags: Pick<Tag, 'name'>[];
    contentType: 'basic' | 'markdown';
}

export interface SaveUser {
    id: string;
    email?: string;
    accessToken: string;
}

export interface Admins {
    id: string;
    globalName: string;
    username: string;
    discriminator: string;
    avatar: string;
}
