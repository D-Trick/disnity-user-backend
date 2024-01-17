// utils
import { getTimestamp, getDate } from '@utils/discord/snowflake';

// ----------------------------------------------------------------------

describe('Discord Snowflake', () => {
    const snowflakeId = '1149206920645836840';

    it(`snowflake id에서 timestamp를 가져온다`, async () => {
        // When
        const timestamp = getTimestamp(snowflakeId);

        // Than
        expect(timestamp).toBe(1694062681114);
    });

    it(`snowflake id에서 date를 가져온다`, async () => {
        // When
        const date = getDate(snowflakeId);

        // Than
        expect(date).toStrictEqual(new Date(1694062681114));
    });
});
