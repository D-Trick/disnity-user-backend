// lib
import { IntersectionType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/mapped-types';
// dtos
import { QueryFilterDto, NextjsClientSideQueryDto } from '@common/dtos';

// ----------------------------------------------------------------------

class QueryFilterValidation extends IntersectionType(QueryFilterDto, NextjsClientSideQueryDto) {}

export class QueryStringDto extends PartialType(QueryFilterValidation) {}
