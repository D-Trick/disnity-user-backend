const EPOCH = 1577836800000; // 표준시 기준 2020년 1월 1일 0시 0분 0초를 밀리초로 만듬

export function generateSnowflakeId() {
    const TIMESTAMP_BITS = 42;
    const WORKER_ID_BITS = 5;
    const PROCESS_ID_BITS = 5;
    const SEQUENCE_BITS = 12;

    const MAX_WORKER_ID = Math.pow(2, WORKER_ID_BITS) - 1;
    const MAX_PROCESS_ID = Math.pow(2, PROCESS_ID_BITS) - 1;
    const MAX_SEQUENCE = Math.pow(2, SEQUENCE_BITS) - 1;

    const timestamp = Date.now() - EPOCH;
    const workerId = Math.floor(Math.random() * (MAX_WORKER_ID + 1));
    const processId = Math.floor(Math.random() * (MAX_PROCESS_ID + 1));
    const sequence = Math.floor(Math.random() * (MAX_SEQUENCE + 1));

    const _timestamp = timestamp.toString(2).padStart(TIMESTAMP_BITS, '0');
    const _workerId = workerId.toString(2).padStart(WORKER_ID_BITS, '0');
    const _processId = processId.toString(2).padStart(PROCESS_ID_BITS, '0');
    const _sequence = sequence.toString(2).padStart(SEQUENCE_BITS, '0');

    const createSnowflake = _timestamp + _workerId + _processId + _sequence;
    const snowflake = createSnowflake.toString();

    const snowflakeId = parseInt(snowflake, 2).toString();
    return snowflakeId;
}

export function getTimestamp(snowflakeId: number) {
    const timestamp = EPOCH + snowflakeId / 4194304;
    const date = new Date(timestamp);

    return date;
}
