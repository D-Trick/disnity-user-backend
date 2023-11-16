// lib
import { Injectable } from '@nestjs/common';
// repositories
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

@Injectable()
export class CommonCodeService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly commonCodeRepository: CommonCodeRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 공통코드 목록 가져오기
     * @param {string} code
     */
    async getCommonCodes(code: string) {
        const commonCodes = await this.commonCodeRepository.selectMany({
            select: {
                columns: {
                    id: true,
                    code: true,
                    name: true,
                    value: true,
                },
            },
            where: {
                code,
            },
        });

        return commonCodes;
    }
}
