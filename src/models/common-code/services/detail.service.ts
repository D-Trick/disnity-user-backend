// @nestjs
import { Injectable } from '@nestjs/common';
// repositories
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

@Injectable()
export class CommonCodeDetailService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly commonCodeRepository: CommonCodeRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 공통코드 상세 가져오기
     * @param {string} code
     * @param {string} value
     */
    async commonCode(code: string, value: string) {
        const commonCodes = await this.commonCodeRepository.find({
            select: {
                id: true,
                code: true,
                name: true,
                value: true,
            },
            where: {
                code,
                value,
            },
        });

        return commonCodes;
    }
}
