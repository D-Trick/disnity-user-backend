import dayjs from 'dayjs';

// plugins
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

dayjs.tz.setDefault('Asia/Seoul');

export default dayjs;
