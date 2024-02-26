// lib
import { IsInt, MaxLength, Max, Min, IsOptional } from 'class-validator';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';
// dtos
import { PaginationRequestDto } from '@common/dtos';

// ----------------------------------------------------------------------

export class ServerFilterRequestDto extends PaginationRequestDto {
    @MaxLength(10, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsOptional()
    sort?: string;

    @Max(5000, { message: HTTP_ERROR_MESSAGES['900'] })
    @Min(1, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    @IsOptional()
    min?: number;

    @Max(5000, { message: HTTP_ERROR_MESSAGES['900'] })
    @Min(1, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    @IsOptional()
    max?: number;

    /**
     * DB에 정렬로 사용될 sort를 반환합니다.
     */
    toServerSort(sort?: 'create' | 'refresh_date' | 'member'): string {
        if (!!sort) {
            return sort;
        }

        switch (this.sort) {
            case 'create':
                return 'created_at';
            case 'member':
                return 'member';
            default:
                return 'refresh_date';
        }
    }

    /**
     * 멤버수의 범위 min, max를 반환합니다.
     */
    toMemberRange(): { min: number; max: number } {
        return {
            min: this.min || 0,
            max: this.max || 0,
        };
    }
}
