import _isEmpty from 'lodash/isEmpty';
import _uniq from 'lodash/uniq';
import _uniqBy from 'lodash/uniqBy';
import _difference from 'lodash/difference';
import _differenceBy from 'lodash/differenceBy';

export const isEmpty = _isEmpty;
export const isNotEmpty = (value: any) => !_isEmpty(value);
export const uniq = _uniq;
export const uniqBy = _uniqBy;
export const difference = _difference;
export const differenceBy = _differenceBy;
