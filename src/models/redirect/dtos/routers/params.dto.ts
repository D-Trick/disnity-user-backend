// lib
import { IntersectionType } from '@nestjs/mapped-types';
// dtos
import { ParamGuildIdDto, ParamTypeDto } from '@common/dtos';

// ----------------------------------------------------------------------

export class ParamRedirectBotAddtDto extends IntersectionType(ParamGuildIdDto, ParamTypeDto) {}
