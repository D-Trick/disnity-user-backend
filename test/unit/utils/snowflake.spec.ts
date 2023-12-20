// utils
import { getTimestamp, getDate, getWorkerId, getProcessId, getIncrement, generateSnowflakeId } from '@utils/index';

// ----------------------------------------------------------------------

describe('Disnity Snowflake 테스트', () => {
    const snowflakeId = '1175359657032822824';

    it(`snowflake id를 생성한다`, async () => {
        // When
        const id = generateSnowflakeId();

        // Than
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThanOrEqual(18);
    });

    it(`snowflake id에서 timestampe를 가져온다`, async () => {
        // When
        const timestamp = getTimestamp(snowflakeId);

        // Than
        expect(timestamp).toBe(1858064379363);
    });

    it(`snowflake id에서 date를 가져온다`, async () => {
        // When
        const date = getDate(snowflakeId);

        // Than
        expect(date).toStrictEqual(new Date(1858064379363));
    });

    it(`snowflake id에서 wokerId를 가져온다`, async () => {
        // When
        const workerId = getWorkerId(snowflakeId);

        // Than
        expect(workerId).toBe(2);
    });

    it(`snowflake id에서 processId를 가져온다`, async () => {
        // When
        const processId = getProcessId(snowflakeId);

        // Than
        expect(processId).toBe(3);
    });

    it(`snowflake id에서 increment를 가져온다`, async () => {
        // When
        const increment = getIncrement(snowflakeId);

        // Than
        expect(increment).toBe(40);
    });
});
