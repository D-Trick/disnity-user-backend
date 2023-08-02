// types
import type { Select } from '@databases/ts/types/common-code.type';
// lib
import { Injectable } from '@nestjs/common';
// repositories
import { CommonCodeRepository } from '@databases/repositories/common-code.repository';

// ----------------------------------------------------------------------

@Injectable()
export class CommonCodeService {
    constructor(private readonly commonCodeRepository: CommonCodeRepository) {}

    /**
     * 공통코드 가져오기
     * @param code
     */
    async getCodeByCommon(code: string): Promise<Select[]> {
        const common = this.commonCodeRepository.selectMany({
            where: {
                code,
            },
        });

        return common;
    }
}
