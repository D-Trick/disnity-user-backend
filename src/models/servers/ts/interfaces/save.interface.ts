// entities
import { Tag } from '@databases/entities/tag.entity';
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

interface SaveValues extends Pick<Guild, 'summary' | 'content'> {
    id: string;
    serverOpen: 'public' | 'private';
    categoryId: number;
    linkType: 'invite' | 'membership';
    inviteAuto: 'auto' | 'manual';
    inviteCode: string;
    channelId: string;
    membershipUrl: string;
    tags: Pick<Tag, 'name'>[];
    contentType: string;
}

export interface InertValues extends SaveValues {
    id: string;
}

export interface UpdateValues extends Partial<SaveValues> {
    id: string;
}

export interface Save {
    id: string;
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
