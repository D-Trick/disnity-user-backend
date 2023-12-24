/**
 * Discord API Error Messages
 * https://discord.com/developers/docs/topics/opcodes-and-status-codes
 */
export const DISCORD_API_ERROR_MESSAGES = {
    // Unknown account
    '10001': '존재하지 않는 계정입니다.',

    //Unknown channel
    '10003': '존재하지 않는 채널입니다.',

    // Unknown guild
    '10004': '존재하지 않는 서버입니다.',

    // Unknown invite
    '10006': '존재하지 않는 초대코드입니다.',

    // Unknown member
    '10007': '존재하지 않는 멤버입니다.',

    // Unknown token
    '10012': '존재하지 않는 토큰입니다.',

    // Unknown user
    '10013': '존재하지 않는 유저입니다.',

    // Unknown emoji
    '10014': '존재하지 않는 이모지입니다.',

    //Maximum number of guilds reached
    '30001': '최대 길드 수에 도달했습니다.',

    //Missing access
    '50001': '접근 권한이 없습니다.',

    //Invalid account type
    '50002': '잘못된 계정 유형 입니다.',

    //You lack permissions to perform that action OR Missing Permissions
    '50013': '해당 작업을 수행할 권한이 없습니다.',

    // Invite code was either invalid or taken
    '50020': '초대코드가 잘못되었거나 사용 중입니다.',
};
