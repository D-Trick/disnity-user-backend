// lib
import dayjs from '@lib/dayjs';
import { ValueTransformer } from 'typeorm';

// ----------------------------------------------------------------------

export class LocalDateTimeTransformer implements ValueTransformer {
    // entity -> db로 넣을때
    to(entityValue: Date): Date {
        return dayjs(entityValue).toDate();
    }

    // db -> entity로 가져올때
    from(databaseValue: Date): string {
        return dayjs(databaseValue).format('YYYY-MM-DD HH:mm:ss');
    }
}
