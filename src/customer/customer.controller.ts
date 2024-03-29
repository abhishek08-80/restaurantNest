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
  CustomerService
} from './customer.service';
import {
  CreateCustomerDto
} from '../dto/customer.dto';
import {
  customerSignupValidation
} from '../schema/customer.schema';



@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post('/create')
  create(@Body() createCustomerDto: CreateCustomerDto) {

    const validator = customerSignupValidation.validate(createCustomerDto, { abortEarly: false })
    if (validator.error) {
      const errorMessage = validator.error.details.map(
        (error) => error.message,
      )
      return { message: 'Validation Failed', errors: errorMessage };
    }

    return this.customerService.create(createCustomerDto);
  }

  

  @Get('/getAll')
  async findAll(@Query() model ) {
    try {
      return (await this.customerService.findAll(model)) ;
    } catch (error) {
    return error   
    }
  }


  @Get('/getCustomerById:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.customerService.findOne(id);
    } catch (error) {
      return error
    }
  }


  @Delete('/delete:id')
  remove(@Param('id') id: string) {
    try {
      return this.customerService.remove(id);
    } catch (error) {
   return error   
    }
  }


}