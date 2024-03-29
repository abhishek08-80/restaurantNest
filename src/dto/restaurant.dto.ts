import {
    PartialType
  } from '@nestjs/mapped-types';
  import { Hobbies, Role} from '../utills/enums/enum'
import { Date } from 'mongoose';
import { Timestamp } from 'rxjs';
  
  
  export class CreateRestaurantDto {
    id?: string;
    name!: string;
    email!: string;
    address!: string;
    password!: string;
    otp?: number;
    otpExpiration?: Date;
    isActive?: boolean;
    startTime!: number;
    endTime!: Date;
  }
