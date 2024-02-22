// @nestjs
import { Injectable } from '@nestjs/common';
// services
import { CommonCodeDataService } from './services/data.service';
import { CommonCodeDetailService } from './services/detail.service';

// ----------------------------------------------------------------------

@Injectable()
export class CommonCodeService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataService: CommonCodeDataService,
        private readonly detailService: CommonCodeDetailService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * dataService
     ******************************/
    /**
     * 공통코드 목록 가져오기
     * @param {string} code
     */
    async getCommonCodes(code: string) {
        return await this.dataService.getCommonCodes(code);
    }

    /******************************
     * detailService
     ******************************/
    /**
     * 공통코드 상세 가져오기
     * @param {string} code
     * @param {string} value
     */
    async getCommonCode(code: string, value: string) {
        return await this.detailService.getCommonCode(code, value);
    }
}
