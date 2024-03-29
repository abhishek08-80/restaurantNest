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
  DishService
} from './dish.service';
import {
  CreateEmployeeDto
} from '../dto/employee.dto';
import { CreateDishDto } from 'src/dto/dish.dto';
import { createDishValidation } from 'src/schema/dish.schema';



@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) { }

  @Post('/create')
  create(@Body() createDishDto: CreateDishDto) {

    const validator = createDishValidation.validate(createDishDto, { abortEarly: false })
    if (validator.error) {
      const errorMessage = validator.error.details.map(
        (error) => error.message,
      )
      return { message: 'Validation Failed', errors: errorMessage };
    }

    return this.dishService.create(createDishDto);
  }



  @Get('/getAll')
  async findAll(@Query() model) {
    try {
      return await this.dishService.findAll(model);
    } catch (error) {
      return error
    }
  } 


  @Get('/getDishById:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.dishService.findOne(id);
    } catch (error) {
      return error
    }
  }


  @Delete('/delete:id')
  remove(@Param('id') id: string) {
    try {
      return this.dishService.remove(id);
    } catch (error) {
      return error
    }
  }


}