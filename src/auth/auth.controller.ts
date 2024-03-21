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
  LoginEmployeeDto
} from '../dto/login-employee.dto';
import { User } from '../user/user.entity';

import { employeeResetValidation, employeeForgetValidation, employeeLoginValidation, employeeUpdateValidation, forgotPasswordEmail } from 'src/schema/employee.schema';
import { CreateEmployeeDto, UpdateEmployeeDto } from 'src/dto/create-employee.dto';
import { EmployeeService } from 'src/employee/employee.service';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly employeeService: EmployeeService) { }


  
  @Post('/login')
  login(@Body() loginEmployeeDto: LoginEmployeeDto) {

    const validator = employeeLoginValidation.validate(loginEmployeeDto, { abortEarly: false })
    if (validator.error) {
      const errorMessage = validator.error.details.map(
        (error) => error.message,
      )
      return { message: 'Validation Failed', errors: errorMessage };
    }

   

    return this.authService.login(loginEmployeeDto);
  }

  @Put('/updatePassword')
  changePassword(@Body() updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const validator = employeeResetValidation.validate(updateEmployeeDto, { abortEarly: false })
      if (validator.error) {
        const errorMessage = validator.error.details.map(
          (error) => error.message,
        )
        return { message: 'Validation Failed', errors: errorMessage };
      }
      return this.employeeService.changePassword(updateEmployeeDto);
    }

    catch (error) {
      return error
    }
  }


  @Put('/forgetPassword')
  resetPassword(@Body() updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const validator = employeeForgetValidation.validate(updateEmployeeDto, { abortEarly: false })
      if (validator.error) {
        const errorMessage = validator.error.details.map(
          (error) => error.message,
        )
        return { message: 'Validation Failed', errors: errorMessage };
      }
      return this.employeeService.resetPassword(updateEmployeeDto);
    }

    catch (error) {
      return error
    }
  }

  @Post('/forgetPasswordEmail')
  forgetPasswordEmail(@Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      const validator = forgotPasswordEmail.validate(createEmployeeDto, { abortEarly: false })
      if (validator.error) {
        const errorMessage = validator.error.details.map(
          (error) => error.message,
        )
        return { message: 'Validation Failed', errors: errorMessage };
      }
      return this.employeeService.forgetPasswordEmail(createEmployeeDto);
    }

    catch (error) {
      return error
    }
  }


  @Put('/updateEmployeeById/:id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const validator = employeeUpdateValidation.validate(updateEmployeeDto, { abortEarly: false })
      if (validator.error) {
        const errorMessage = validator.error.details.map(
          (error) => error.message,
        )
        return { message: 'Validation Failed', errors: errorMessage };
      }
      return this.employeeService.updateDetails(id, updateEmployeeDto);
    }

    catch (error) {
      return error
    }
  }
  
  


}

