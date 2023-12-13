/**
 * Create Discord Snowflake id
 * https://discord.com/developers/docs/reference#snowflakes
 * /

/**
 * 특정 시간 기준
 */
const EPOCH = 1420070400000;

/**
 * snowflake id를 decode해서 timestamp를 가져온다.
 * @param {string} snowflakeId
 */
export function getTimestamp(snowflakeId: string) {
    const milliseconds = BigInt(snowflakeId) >> 22n;
    const timestamp = milliseconds + BigInt(EPOCH);

    return Number(timestamp);
}

/**
 * snowflake id를 decode해서 date를 가져온다.
 * @param {string} snowflakeId
 */
export function getDate(snowflakeId: string) {
    return new Date(getTimestamp(snowflakeId));
}
