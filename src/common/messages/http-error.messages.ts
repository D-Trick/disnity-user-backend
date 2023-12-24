export const HTTP_ERROR_MESSAGES = {
    /**
     * HTTP Status Message
     */
    '400': '잘못된 요청 입니다.',
    '401': '유효한 인증이 아닙니다.',
    '403': '접근 권한이 없습니다.',
    '404': '요청하신 주소를 찾을 수 없습니다.',
    '429': '요청이 제한됩니다.',
    '500': '서버에서 에러가 발생했습니다.',

    /**
     * Custom HTTP Status Message
     */
    '900': '비정상적인 접근입니다.',
};

export const HTTP_ERROR_DEFAULT_MESSAGES = {
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Not Found',
    '429': 'Too Many Requests',
    '500': 'Internal Server Error',
};
