// lib
import { IsInt, IsString, IsEmpty, MaxLength } from 'class-validator';

// ----------------------------------------------------------------------

export class UserDto {
    @IsInt({ message: '사용자 ID가 잘못된 유형입니다.' })
    @IsEmpty({ message: '사용자 ID가 존재하지 않습니다.' })
    readonly id: number;

    @MaxLength(32, { message: '사용자 이름은 32자 이내 입니다.' })
    @IsString({ message: '사용자 이름이 잘못된 유형입니다.' })
    @IsEmpty({ message: '사용자 이름이 존재하지 않습니다.' })
    readonly name: string;

    @MaxLength(100, { message: '사용자 이름은 100자 이내 입니다.' })
    @IsString({ message: '사용자 이메일이 잘못된 유형입니다.' })
    @IsEmpty({ message: '사용자 이메일이 존재하지 않습니다.' })
    readonly email: string;

    @IsString({ message: '사용자 프로필 이미지가 잘못된 유형입니다.' })
    @IsEmpty({ message: '사용자 프로필 이미지가 존재하지 않습니다.' })
    readonly avatar: string;

    @MaxLength(10, { message: '사용자 언어는 10자 이내 입니다.' })
    @IsString({ message: '사용자 언어가 잘못된 유형입니다.' })
    @IsEmpty({ message: '사용자 언어가 존재하지 않습니다.' })
    readonly locale: string;

    @IsString({ message: '생성날짜가 잘못된 유형입니다.' })
    readonly created_at: Date | (() => string);

    @IsString({ message: '수정날짜가 잘못된 유형입니다.' })
    readonly updated_at: Date | (() => string);
}
