// lib
import { MaxLength } from 'class-validator';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

/**
 * Next.js에서 ClientSide로 페이지 이동시 동적 param을 queryString으로 값을 넘긴다.
 * queryString에서도 처리가 가능하게 DTO생성
 */
export class NextjsClientSideQueryDto {
    @MaxLength(100, { message: HTTP_ERROR_MESSAGES['900'] })
    id?: string;

    @MaxLength(5000, { message: HTTP_ERROR_MESSAGES['900'] })
    name?: string;

    @MaxLength(5000, { message: HTTP_ERROR_MESSAGES['900'] })
    keyword?: string;
}
