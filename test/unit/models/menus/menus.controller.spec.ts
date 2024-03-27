// types
import type { MenuTree } from '@models/menus/helpers/format-menu-tree';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// lib
import { plainToInstance } from 'class-transformer';
// dtos
import { ParamTypeRequestDto } from '@common/dtos';
import { MenuListResponseDto } from '@models/menus/dtos';
// controllers
import { MenusController } from '@models/menus/menus.controller';
// services
import { MenusListService } from '@models/menus/services/list.service';

// ----------------------------------------------------------------------

describe('MenusController', () => {
    let menusController: MenusController;

    const menusServiceMock: MenusListService = mock(MenusListService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [MenusController],
            providers: [{ provide: MenusListService, useValue: instance(menusServiceMock) }],
        }).compile();

        menusController = moduleRef.get<MenusController>(MenusController);
    });

    describe('menus', () => {
        it(`메뉴 목록을 조회한다`, async () => {
            // Given
            const param = plainToInstance(ParamTypeRequestDto, {
                type: 'uHeader',
            });
            const dataMock: MenuTree = {
                subHeader: '',
                menus: [],
            };
            when(menusServiceMock.getMenus(param.type, '디스코드 서버')).thenResolve(dataMock);

            // When
            const menus = await menusController.menus(param);

            // Than
            expect(menus).toStrictEqual([new MenuListResponseDto(dataMock)]);
        });
    });
});
