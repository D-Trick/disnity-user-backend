// utils
import { generateBulkUpdateQuery } from '@utils/database';

// ----------------------------------------------------------------------

describe('Bulk Update를 위한 쿼리 포맷팅', () => {
    test(`Bulk Update 쿼리문을 생성한다`, async () => {
        // Given
        const updateIds = [1, 2];
        const updateValues = [
            { name: '이름1', content: '내용1' },
            { name: '이름2', content: '내용2' },
        ];

        // When
        const { bulkValues, bulkParameters } = generateBulkUpdateQuery(updateIds, updateValues);

        // Than
        expect(bulkValues.name()).toBe(`CASE id WHEN 1 THEN :name1 WHEN 2 THEN :name2 END`);
        expect(bulkValues.content()).toBe(`CASE id WHEN 1 THEN :content1 WHEN 2 THEN :content2 END`);
        expect(bulkParameters.name1).toBe('이름1');
        expect(bulkParameters.content1).toBe('내용1');
        expect(bulkParameters.name2).toBe('이름2');
        expect(bulkParameters.content2).toBe('내용2');
    });

    test(`업데이트시킬 컬럼이 없으면 실패한다`, async () => {
        // Given
        const updateIds = [];
        const updateValues = [{ a: 1, b: 2 }];

        // When
        const wrapFunction = () => generateBulkUpdateQuery(updateIds, updateValues);

        // Than
        expect(wrapFunction).toThrow('[BulkUpdate] 업데이트시킬 컬럼이 없습니다.');
    });

    test(`업데이트시킬 데이터가 없으면 실패한다`, async () => {
        // Given
        const updateIds = [1, 2, 3];
        const updateValues = [];

        // When
        const wrapFunction = () => generateBulkUpdateQuery(updateIds, updateValues);

        // Than
        expect(wrapFunction).toThrow('[BulkUpdate] 업데이트시킬 데이터가 없습니다.');
    });

    test(`업데이트시킬 데이터와 컬럼 개수가 맞지 않으면 실패한다`, async () => {
        // Given
        const updateIds = [1, 2, 3];
        const updateValues = [{ a: 1, b: 2 }];

        // When
        const wrapFunction = () => generateBulkUpdateQuery(updateIds, updateValues);

        // Than
        expect(wrapFunction).toThrow('[BulkUpdate] 업데이트시킬 데이터와 컬럼의 개수가 같지 않습니다. (1 / 3)');
    });
});

// ----------------------------------------------------------------------
