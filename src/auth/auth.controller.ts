import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put
} from '@nestjs/common';
import {
  AuthService
} from './auth.service';
import {
  LoginDto
} from '../dto/auth.dto';

import { customerResetValidation, customerForgetValidation, customerLoginValidation, customerUpdateValidation, forgotPasswordEmail } from 'src/schema/customer.schema';
import { UpdateDto } from 'src/dto/auth.dto';
import { CreateCustomerDto} from 'src/dto/customer.dto';
import { CustomerService } from 'src/customer/customer.service';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly customerService: CustomerService) { }


  
  @Post('/login')
  login(@Body() loginDto: LoginDto) {

    const validator = customerLoginValidation.validate(loginDto, { abortEarly: false })
    if (validator.error) {
      const errorMessage = validator.error.details.map(
        (error) => error.message,
      )
      return { message: 'Validation Failed', errors: errorMessage };
    }

    console.log(loginDto)
   

    return this.authService.login(loginDto);
  }

  @Put('/updatePassword')
  changePassword(@Body() updateDto: UpdateDto) {
    try {
      const validator = customerResetValidation.validate(updateDto, { abortEarly: false })
      if (validator.error) {
        const errorMessage = validator.error.details.map(
          (error) => error.message,
        )
        return { message: 'Validation Failed', errors: errorMessage };
      }
      return this.customerService.changePassword(updateDto);
    }

    catch (error) {
      return error
    }
  }


  @Put('/forgetPassword')
  resetPassword(@Body() updateDto: UpdateDto) {
    try {
      const validator = customerForgetValidation.validate(updateDto, { abortEarly: false })
      if (validator.error) {
        const errorMessage = validator.error.details.map(
          (error) => error.message,
        )
        return { message: 'Validation Failed', errors: errorMessage };
      }
      return this.customerService.resetPassword(updateDto);
    }

    catch (error) {
      return error
    }
  }

  @Post('/forgetPasswordEmail')
  forgetPasswordEmail(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const validator = forgotPasswordEmail.validate(createCustomerDto, { abortEarly: false })
      if (validator.error) {
        const errorMessage = validator.error.details.map(
          (error) => error.message,
        )
        return { message: 'Validation Failed', errors: errorMessage };
      }
      return this.customerService.forgetPasswordEmail(createCustomerDto);
    }

    catch (error) {
      return error
    }
  }


  @Put('/updateCustomerById/:id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    try {
      const validator = customerUpdateValidation.validate(updateDto, { abortEarly: false })
      if (validator.error) {
        const errorMessage = validator.error.details.map(
          (error) => error.message,
        )
        return { message: 'Validation Failed', errors: errorMessage };
      }
      return this.customerService.updateDetails(id, updateDto);
    }

    catch (error) {
      return error
    }
  }
  
  


}

