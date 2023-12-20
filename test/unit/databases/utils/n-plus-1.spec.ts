// utils
import Nplus1 from '@databases/utils/n-plus-1';

// ----------------------------------------------------------------------

describe('N + 1 해결을 위한 데이터 그룹화', () => {
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
                selectColumns: [{ originalName: 'group2_name', changeName: 'name' }],
            },
        ],
    };

    test(`쿼리 결과의 대한 데이터 그룹화`, async () => {
        const n1 = new Nplus1(DATA, options);

        n1.getMany().map((m: any) => {
            expect(m).toHaveProperty('id');
            expect(m).toHaveProperty('name');

            expect(m).toHaveProperty('group1');
            m.group1.map((group1) => {
                expect(group1).toHaveProperty('name');
            });

            expect(m).toHaveProperty('group2');
            m.group2.map((group2) => {
                expect(group2).toHaveProperty('name');
            });
        });
    });

    test(`값에 undefined가 있으면 에러가 발생한다.`, async () => {
        const n1 = new Nplus1(ERROR_DATA1, options);

        expect(() => n1.getMany()).toThrow();
    });

    test(`값에 function이 있으면 에러가 발생한다.`, async () => {
        const n1 = new Nplus1(ERROR_DATA2, options);

        expect(() => n1.getMany()).toThrow();
    });

    test(`값에 symbol이 있으면 에러가 발생한다.`, async () => {
        const n1 = new Nplus1(ERROR_DATA3, options);

        expect(() => n1.getMany()).toThrow();
    });
});

// ----------------------------------------------------------------------

export const DATA = [
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

export const ERROR_DATA1 = [
    {
        id: '1',
        name: '테스트1',
        group1_id: '1',
        group1_name: '그룹1-1',
        group2_id: '1',
        group2_name: undefined,
    },
];

export const ERROR_DATA2 = [
    {
        id: '1',
        name: '테스트1',
        group1_id: '1',
        group1_name: '그룹1-1',
        group2_id: '1',
        group2_name: () => 'test',
    },
];

export const ERROR_DATA3 = [
    {
        id: '1',
        name: '테스트1',
        group1_id: '1',
        group1_name: '그룹1-1',
        group2_id: '1',
        group2_name: Symbol('TEST'),
    },
];
