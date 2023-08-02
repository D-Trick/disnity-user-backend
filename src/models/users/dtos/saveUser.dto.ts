// lib
import { PartialType } from '@nestjs/mapped-types';
// dtos
import { UserDto } from './user.dto';

// ----------------------------------------------------------------------

export class SaveUserDto extends PartialType(UserDto) {}
