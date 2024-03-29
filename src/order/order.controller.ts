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
  OrderService
} from './order.service';
import {
  CreateEmployeeDto
} from '../dto/employee.dto';
import { CreateOrderDto } from 'src/dto/order.dto';
import { createOrderValidation } from 'src/schema/order.schema';



@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('/create')
  create(@Body() createOrderDto: CreateOrderDto) {

    const validator = createOrderValidation.validate(createOrderDto, { abortEarly: false })
    if (validator.error) {
      const errorMessage = validator.error.details.map(
        (error) => error.message,
      )
      return { message: 'Validation Failed', errors: errorMessage };
    }

    return this.orderService.create(createOrderDto);
  }



  @Get('/getAll')
  async findAll(@Query() model) {
    try {
      return await this.orderService.findAll(model);
    } catch (error) {
      return error
    }
  } 


  @Get('/getOrderById:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.orderService.findOne(id);
    } catch (error) {
      return error
    }
  }


  @Delete('/delete:id')
  remove(@Param('id') id: string) {
    try {
      return this.orderService.remove(id);
    } catch (error) {
      return error
    }
  }


}