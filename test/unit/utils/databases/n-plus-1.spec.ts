// types
import type { Config } from '@utils/database';
// utils
import { Nplus1 } from '@utils/database';

// ----------------------------------------------------------------------
interface Group {
    id: string;
    name: string;
    group1: {
        name: string;
    }[];

    group2: {
        name: string;
    }[];
}
// ----------------------------------------------------------------------

const DATA = [
    {
        id: '1',
        name: '테스트1',
        group1_id: '1',
        group1_name: '그룹1-1',
        group2_id: '1',
        group2_name: '그룹2-1',
    },
    {
        id: '1',
        name: '테스트1',
        group1_id: '1',
        group1_name: '그룹1-2',
        group2_id: '1',
        group2_name: '그룹2-2',
    },
    {
        id: '2',
        name: '테스트2',
        group1_id: '2',
        group1_name: '그룹1-1',
        group2_id: '2',
        group2_name: '그룹2-1',
    },
    {
        id: '2',
        name: '테스트2',
        group1_id: '2',
        group1_name: '그룹1-2',
        group2_id: '2',
        group2_name: '그룹2-2',
    },
];

const options = {
    primaryColumn: 'id',
    joinGroups: [
        {
            outputColumn: 'group1',
            referenceColumn: 'group1_id',
            selectColumns: [{ originalName: 'group1_name', changeName: 'name' }],
        },
        {
            outputColumn: 'group2',
            referenceColumn: 'group2_id',
            selectColumns: [{ originalName: 'group2_name' }],
        },
    ],
};

describe('N + 1 해결을 위한 데이터 그룹화 테스트', () => {
    test(`Query Result의 데이터를 그룹화 시킨다.`, async () => {
        // When
        const n1 = new Nplus1<Group>(DATA, options);
        const mockList = n1.getMany();

        // Than
        expect(mockList[0]).toHaveProperty('id');
        expect(mockList[0]).toHaveProperty('name');

        expect(mockList[0]).toHaveProperty('group1');
        expect(mockList[0].group1[0]).toHaveProperty('name');

        expect(mockList[0]).toHaveProperty('group2');
        expect(mockList[0].group2[0]).toHaveProperty('group2_name');
    });

    test(`Query Result의 값이 undefined가 있으면 실패`, async () => {
        // Given
        const ERROR_DATA = [
            {
                id: '1',
                name: '테스트1',
                group1_id: '1',
                group1_name: '그룹1-1',
                group2_id: '1',
                group2_name: undefined,
            },
        ];

        // When
        const n1 = new Nplus1(ERROR_DATA, options);

        // Than
        expect(() => n1.getMany()).toThrow();
    });

    test(`Query Result의 값이 function이 있으면 실패`, async () => {
        // Given
        const ERROR_DATA = [
            {
                id: '1',
                name: '테스트1',
                group1_id: '1',
                group1_name: '그룹1-1',
                group2_id: '1',
                group2_name: () => 'test',
            },
        ];

        // When
        const n1 = new Nplus1(ERROR_DATA, options);

        // Than
        expect(() => n1.getMany()).toThrow();
    });

    test(`Query Result의 값이 symbol이 있으면 실패`, async () => {
        // Given
        const ERROR_DATA = [
            {
                id: '1',
                name: '테스트1',
                group1_id: '1',
                group1_name: '그룹1-1',
                group2_id: '1',
                group2_name: Symbol('TEST'),
            },
        ];

        // When
        const n1 = new Nplus1(ERROR_DATA, options);

        // Than
        expect(() => n1.getMany()).toThrow();
    });

    test(`options이 하나라도 없으면 실패`, async () => {
        // Given
        const options1: any = '';
        const options2: Config = { primaryColumn: '', joinGroups: [] };
        const options3: Config = { primaryColumn: 'id', joinGroups: [] };

        // When
        const wrap1 = () => new Nplus1<Group>(DATA, options1);
        const wrap2 = () => new Nplus1<Group>(DATA, options2);
        const wrap3 = () => new Nplus1<Group>(DATA, options3);

        // Than
        expect(wrap1).toThrow('config.primaryColumn Option이 없습니다.');
        expect(wrap2).toThrow('config.primaryColumn Option이 없습니다.');
        expect(wrap3).toThrow('config.joinGroups Option이 없습니다.');
    });

    test(`options의 primaryColumn, referenceColumn, originalName이 Query Result의 컬럼에 하나라도 포함되는게 없으면 실패`, async () => {
        // Given
        const options1: Config = {
            primaryColumn: '',
            joinGroups: [],
        };
        const options2: Config = {
            primaryColumn: 'id',
            joinGroups: [
                {
                    outputColumn: 'group',
                    referenceColumn: 'group',
                    selectColumns: [],
                },
            ],
        };
        const options3: Config = {
            primaryColumn: 'id',
            joinGroups: [
                {
                    outputColumn: 'group',
                    referenceColumn: 'group1_id',
                    selectColumns: [{ originalName: 'group1' }],
                },
            ],
        };

        // When
        const wrap1 = () => new Nplus1<Group>(DATA, options1);
        const wrap2 = () => new Nplus1<Group>(DATA, options2);
        const wrap3 = () => new Nplus1<Group>(DATA, options3);

        // Than
        expect(wrap1).toThrow('config.primaryColumn Option이 없습니다.');
        expect(wrap2).toThrow('Column: group이(가) 없습니다.');
        expect(wrap3).toThrow('Column: group1이(가) 없습니다.');
    });
});
