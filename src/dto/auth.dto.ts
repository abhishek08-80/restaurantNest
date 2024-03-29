import { PartialType } from "@nestjs/swagger";
import { CreateCustomerDto } from "./customer.dto";

export class UpdateDto extends PartialType(CreateCustomerDto) { 
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export class LoginDto {
    email!: string;
    password?: string;
    role?: string;
    id?: string
  }