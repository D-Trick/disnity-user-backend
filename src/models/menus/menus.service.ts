// @nestjs
import { Injectable } from '@nestjs/common';
// services
import { MenusDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Injectable()
export class MenusService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly dataService: MenusDataService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * dataService
     ******************************/
    /**
     * 타입에 맞는 메뉴 트리 가져오기
     * @param {string} type
     * @param {string} subHeaderName
     */
    async getMenus(type: string, subHeaderName: string) {
        return await this.dataService.getMenus(type, subHeaderName);
    }
}
