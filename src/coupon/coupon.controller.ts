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
  CouponService
} from './coupon.service';
import { CreateCouponDto } from 'src/dto/coupon.dto';
import { createCouponValidation } from 'src/schema/coupon.schema';



@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  @Post('/create')
  create(@Body() createCouponDto: CreateCouponDto) {

    const validator = createCouponValidation.validate(createCouponDto, { abortEarly: false })
    if (validator.error) {
      const errorMessage = validator.error.details.map(
        (error) => error.message,
      )
      return { message: 'Validation Failed', errors: errorMessage };
    }

    return this.couponService.create(createCouponDto);
  }



  @Get('/getAll')
  async findAll(@Query() model) {
    try {
      return await this.couponService.findAll(model);
    } catch (error) {
      return error
    }
  } 


  @Delete('/delete:id')
  remove(@Param('id') id: string) {
    try {
      return this.couponService.remove(id);
    } catch (error) {
      return error
    }
  }


}