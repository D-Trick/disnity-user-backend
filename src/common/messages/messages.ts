export const ERROR_MESSAGES = {
    /**
     * HTTP StatusCode
     */
    E400: '잘못된 요청 입니다.',
    E401: '정상적인 인증이 아닙니다.',
    E403: '권한이 없습니다.',
    E404: '요청하신 주소를 찾을 수 없습니다.',
    E429: '요청이 제한됩니다.',
    E500: '서버에서 처리할 수가 없습니다.',

    /**
     * Custom HTTP Error Message
     */
    E900: '비정상적인 접근입니다.',

    /**
     * Auth Error Message
     */
    LOGIN_FAIL: '로그인 처리를 실패했습니다.\n문제가 지속되는 경우 문의 해주시길 바랍니다.',
    LOGIN_PLEASE: '로그인을 해주세요.',

    /**
     * Discord Error Message
     */
    BOT_NOT_FOUND: '디스니티 봇을 추가해주세요.',

    /**
     * Server Error Message
     */
    SERVER_NOT_FOUND: '존재하지 않는 서버입니다.',
    SERVER_NOT_FOUND_OR_NOT_PERMISSION: '서버가 없거나 권한이 없습니다.',
    SERVER_EXISTE: '이미 게시된 서버입니다.',
    DELETE_SERVER_NOT_FOUND: '해당 서버는 존재하지않기 때문에 작업을 처리 할 수 없습니다.',
    CATEGORY_NOT_FOUND: '존재하지 않는 카테고리입니다.',
    SERVER_OPEN_NOT_SELECT: '서버공개 여부를 선택해주세요.',
    MEMBERSHIP_OPEN_NOT_SELECT: '가입문의 여부를 선택해주세요.',
    AUTO_INVITE_EMPTY: '초대코드를 입력해주세요.',
    SUMMARY_MAX_LENGTH: '서버 요약 설명은 최대 250글자 입니다.',
    CONTENT_TYPE_EMPTY: '내용 유형을 선택해주세요.',
    CONTENT_TYPE_MAX_LENGTH: '내용 유형은 최대 8글자 입니다.',
    MEMBERSHIP_URL_EMPTY: '사이트 주소를 입력해주세요.',
    MEMBERSHIP_URL_NOT_FORM: 'URL 주소 형식이 아닙니다.',
    MEMBERSHIP_MAX_LENGTH: '사이트 주소는 최대 100글자 입니다.',
    TAG_NAME_FILTER: '#,/,&,?,,공백,*,@,%,+ 문자는 사용 할 수 없습니다.',
    TAG_NAME_MAX_LENGTH: '태그는 최대 10글자 입니다.',
    INVITE_EMPTY: '초대코드를 입력해주세요.',
    INVITE_MAX_LENGTH: '초대코드는 최대 15글자 입니다.',
    CHANNEL_NOT_FOUND: '존재하지 않는 채널입니다.',
    PRAMITER_REQUIRED: '하나 이상의 PARAMETER가 필요합니다.',
};
