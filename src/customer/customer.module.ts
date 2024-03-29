import {
    Module, forwardRef
  } from '@nestjs/common';
  import {
    CustomerService
  } from './customer.service';
  import {
    CustomerController
    } from './customer.controller';
  import {
    Customer,
    CustomerSchema
  } from '../model/customer.model';
  import {
    MongooseModule
  } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
  
  @Module({
    imports: [
     MongooseModule.forFeature([
        {
          name: Customer.name,
          schema: CustomerSchema
        },
     ]),
     forwardRef(() => AuthModule)
    ],
    
    controllers: [CustomerController],
    providers: [CustomerService],
    exports:[CustomerService]
  })
  export class CustomerModule {}