// types
import type { FindByType } from '@databases/types/menu.type';
import type { MenuTree } from '@models/menus/helpers/format-menu-tree';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anything } from 'ts-mockito';
// services
import { CacheDataService } from '@cache/cache-data.service';
import { MenusListService } from '@models/menus/services/list.service';
// repositories
import { MenuRepository } from '@databases/repositories/menu';

// ----------------------------------------------------------------------

describe('MenusListService', () => {
    let menusListService: MenusListService;

    const cacheDataServiceMock: CacheDataService = mock(CacheDataService);

    const menuRepositoryMock: MenuRepository = mock(MenuRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                MenusListService,
                { provide: CacheDataService, useValue: instance(cacheDataServiceMock) },
                { provide: MenuRepository, useValue: instance(menuRepositoryMock) },
            ],
        }).compile();

        menusListService = moduleRef.get<MenusListService>(MenusListService);
    });

    describe('getMenus', () => {
        it(`캐시에서 메뉴 목록을 조회합니다.`, async () => {
            // Given
            const type = 'uHeader';
            const dataMock: MenuTree = {
                subHeader: '디스코드 서버',
                menus: [
                    {
                        id: 1,
                        parent_id: 0,
                        name: '',
                        path: '',
                        icon: '',
                        caption: '',
                        disabled: false,
                        depth: 0,
                        sort: 0,
                        children: [],
                    },
                ],
            };
            when(cacheDataServiceMock.getMenusByType(type)).thenResolve(dataMock);

            // When
            const menus = await menusListService.getMenus(type, '디스코드 서버');

            // Than
            expect(menus).toStrictEqual(dataMock);
        });

        it(`DB에서 메뉴를 조회합니다.`, async () => {
            // Given
            const type = 'uHeader';
            const dataMock1: FindByType[] = [
                {
                    id: 1,
                    parent_id: 0,
                    name: '',
                    path: '',
                    icon: '',
                    caption: '',
                    disabled: false,
                    depth: 0,
                    sort: 0,
                },
            ];
            const dataMock2: MenuTree = {
                subHeader: '디스코드 서버',
                menus: [
                    {
                        ...dataMock1[0],
                        children: [],
                    },
                ],
            };
            when(cacheDataServiceMock.getMenusByType(type)).thenResolve(undefined);
            when(menuRepositoryMock.findByType(anything())).thenResolve(dataMock1);

            // When
            const menus = await menusListService.getMenus(type, '디스코드 서버');

            // Than
            expect(menus).toStrictEqual(dataMock2);
        });
    });
});
