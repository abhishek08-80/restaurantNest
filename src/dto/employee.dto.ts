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
    otp: number;
    otpExpiration: Date;
    isActive: boolean;
    restaurantId: string;
  }

  