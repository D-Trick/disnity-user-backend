/**
 * Discord API Error Messages
 * https://discord.com/developers/docs/topics/opcodes-and-status-codes
 */
export const DISCORD_ERROR_MESSAGES = {
    // Unknown account
    E10001: '존재하지 않는 계정입니다.',

    //Unknown channel
    E10003: '존재하지 않는 채널입니다.',

    // Unknown guild
    E10004: '존재하지 않는 서버입니다.',

    // Unknown invite
    E10006: '존재하지 않는 초대코드입니다.',

    // Unknown member
    E10007: '존재하지 않는 멤버입니다.',

    // Unknown token
    E10012: '존재하지 않는 토큰입니다.',

    // Unknown user
    E10013: '존재하지 않는 유저입니다.',

    // Unknown emoji
    E10014: '존재하지 않는 이모지입니다.',

    //Maximum number of guilds reached
    E30001: '최대 길드 수에 도달했습니다.',

    //Missing access
    E50001: '접근 권한이 없습니다.',

    //Invalid account type
    E50002: '잘못된 계정 유형 입니다.',

    //You lack permissions to perform that action OR Missing Permissions
    E50013: '해당 작업을 수행할 권한이 없습니다.',

    // Invite code was either invalid or taken
    E50020: '초대코드가 잘못되었거나 사용 중입니다.',
};
