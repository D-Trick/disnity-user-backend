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
     * 공통코드 가져오기
     * @param {string} code
     */
    async getCommonCode(code: string) {
        const common = this.commonCodeRepository.selectMany({
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

        return common;
    }
}
