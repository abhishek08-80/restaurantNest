import {
  Injectable
} from '@nestjs/common';
import {
  InjectModel
} from '@nestjs/mongoose';
import {
  Model
} from 'mongoose';
import { Dish, DishDocument } from 'src/model/dish.model';
import { CreateDishDto } from 'src/dto/dish.dto';
import slugify from "slugify";
import { RestaurantService } from 'src/restaurant/restaurant.service';



@Injectable()
export class DishService {

  constructor(@InjectModel(Dish.name) private readonly dishModel: Model<DishDocument>,
   private restaurantModel : RestaurantService
  ) { }

  async create(createDishDto: CreateDishDto): Promise<DishDocument> { 
    const result: any = { data: [], metadata: null, error: [] }

    try {
      const { restaurantId, name }:any = createDishDto;
       const isExsit = await this.restaurantModel.findOne(restaurantId)
       console.log(isExsit) 
      if (!isExsit) {
        result.error = { message: "restaurant does not exists" }
        return result
      }
      const slug: string = slugify(name, { lower: true })
      
      const existingDish = await this.dishModel.findOne({ slug: slug, restaurantId: restaurantId})
      if(existingDish){
        result.error = { message: "dish already exists" }
        return result
      }
      
      createDishDto.slug = slug
      const newDish = await this.dishModel.create(createDishDto)
      return newDish
    } catch (error) {
      return error
    }
  }

  async findAll(model: any): Promise<DishDocument[]> {
    const result: any = { data: [], metadata: [], error: null }

    try {
      const page = model.page
      const search = model.search
      let limit = model.limit;
      if (!limit) {
        limit = 2
      }
      if (search == undefined) {
        result.data = await this.dishModel.find().limit(limit).skip((page - 1) * limit).sort({ name: -1 });
      }
      else {
        result.data = await this.dishModel.find(
          {
            '$or': [
              { 'name': { $regex: model.search } },
              { 'category': { $regex: model.search } }
            ]
          }
        ).limit(limit).skip((page - 1) * limit).sort({ name: -1 });

      }
      result.metadata = await this.dishModel.countDocuments()

      return result

    } catch (error) {
      console.log(error)
      throw error
    }
  }




  async findOne(data) {
    try {
      
      return this.dishModel.findById(data);
    } catch (error) {
      
    }
  }
  

  async findByAttribute(dishId) {  
    try { 
      // const {} = data 
      
      const existingDish = await this.dishModel.find({'_id': { $in : dishId }}).lean()
      // .select('-_id')
      console.log('start',existingDish, "end")
      if (existingDish.length !==dishId.length) {
        console.log(existingDish.length !==dishId.length)
        return null 
      }
      return existingDish
      // return this.dishModel.findByIdAndUpdate(existingDish);
    } catch (error) {
      console.log(error)
      return error
    } 
  }

  
 
  // async updateDetails(id: string, updateCustomerDto: UpdateCustomerDto): Promise<EmployeeDocument> {
  //   const result: any = { data: [], metadata: null, error: [] }

  //   try {
  //     const { hobbies, ...rest } = updateCustomerDto;
  //     const existingUser = await this.dishModel.findOne({ _id: id }).lean()
  //     if (!existingUser) {
  //       result.error = { message: "Employee does not exists" }
  //       return result
  //     }
  //     const updatedHobbies = [...existingUser.hobbies, ...updateCustomerDto.hobbies];

  //     const finlaobj = { ...updatedHobbies, ...rest }
  //     console.log(finlaobj, 'dddddd')
  //     return await this.dishModel.findByIdAndUpdate(id, { $set: (finlaobj) }, { new: true });
  //   } catch (error) {
  //     console.log(error)
  //     return error
  //   }
  // }



 

  async remove(id: string) {
    const result: any = { data: [], metadata: null, error: [] }
    try {
      const findEmployee = this.dishModel.findOne({ id })
      if (!findEmployee) {
        result.error = { message: "employee does not exists" }
        return result
      }
      const removeEmployee = this.dishModel.findByIdAndDelete(id);

    } catch (error) {
      return error
    }
  }


  
}