import {
  PartialType
} from '@nestjs/mapped-types';
import { Hobbies,Role} from '../utills/enums/enum'


export class CreateCustomerDto {
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

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) { 
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class LoginCustomerDto {
  email?: string;
  password?: string;
  role?: string;
  id?: string
}
