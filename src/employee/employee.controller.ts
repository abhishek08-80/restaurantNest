import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query
} from '@nestjs/common';
import {
  EmployeeService
} from './employee.service';
import {
  CreateEmployeeDto
} from '../dto/create-employee.dto';
import {
  employeeSignupValidation
} from '../schema/employee.schema';



@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post('/create')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {

    const validator = employeeSignupValidation.validate(createEmployeeDto, { abortEarly: false })
    if (validator.error) {
      const errorMessage = validator.error.details.map(
        (error) => error.message,
      )
      return { message: 'Validation Failed', errors: errorMessage };
    }

    return this.employeeService.create(createEmployeeDto);
  }

  

  @Get('/getAllEmployee')
  async findAll(@Query() model ) {
    try {
      return (await this.employeeService.findAll(model)) ;
    } catch (error) {
    return error   
    }
  }


  @Get('/getEmployeeById:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.employeeService.findOne(id);
    } catch (error) {
      return error
    }
  }


  @Delete('/deleteEmployee:id')
  remove(@Param('id') id: string) {
    try {
      return this.employeeService.remove(id);
    } catch (error) {
   return error   
    }
  }


}