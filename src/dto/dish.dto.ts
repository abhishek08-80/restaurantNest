import {
    PartialType
  } from '@nestjs/mapped-types';
  import { Category} from '../utills/enums/enum'
  
  
  export class CreateDishDto {
    id: String;
    name: String;
    category: Category;
    isActive: Boolean;
    restaurantId: String;
    price: Number;
    slug: String;
  }

  