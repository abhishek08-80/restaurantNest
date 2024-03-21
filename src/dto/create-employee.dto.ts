import {
  PartialType
} from '@nestjs/mapped-types';
import { Hobbies, Role} from '../utills/enums/enum'


export class CreateEmployeeDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
  role: Role;
  hobbies: Hobbies;
  otp: number;
  otpExpiration: Date;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) { 
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}