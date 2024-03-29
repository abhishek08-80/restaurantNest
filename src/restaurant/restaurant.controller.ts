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
  RestaurantService
} from './restaurant.service';
import {
  CreateEmployeeDto
} from '../dto/employee.dto';
import {
  customerSignupValidation
} from '../schema/customer.schema';
import { restaurantSignupValidation } from 'src/schema/restaurant.schema';
import { CreateRestaurantDto } from 'src/dto/restaurant.dto';



@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Post('/create')
  create(@Body() createRestaurantDto: CreateRestaurantDto) {

    const validator = restaurantSignupValidation.validate(createRestaurantDto, { abortEarly: false })
    if (validator.error) {
      const errorMessage = validator.error.details.map(
        (error) => error.message,
      )
      return { message: 'Validation Failed', errors: errorMessage };
    }

    return this.restaurantService.create(createRestaurantDto);
  }

  

  @Get('/getAll')
  async findAll(@Query() model ) {
    try {
      return (await this.restaurantService.findAll(model)) ;
    } catch (error) {
    return error   
    }
  }


  @Get('/getById:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.restaurantService.findOne(id);
    } catch (error) {
      return error
    }
  }


  @Delete('/delete:id')
  remove(@Param('id') id: string) {
    try {
      return this.restaurantService.remove(id);
    } catch (error) {
   return error   
    }
  }


}