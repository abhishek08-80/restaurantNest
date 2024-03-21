import {
    Module, forwardRef
  } from '@nestjs/common';
  import {
    EmployeeService
  } from './employee.service';
  import {
    EmployeeController
  } from './employee.controller';
  import {
    Employee,
    EmployeeSchema
  } from '../model/employee.model';
  import {
    MongooseModule
  } from '@nestjs/mongoose';
  
  @Module({
    imports: [
     MongooseModule.forFeature([
        {
          name: Employee.name,
          schema: EmployeeSchema
        },
     ])
    ],
    
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports:[EmployeeService]
  })
  export class EmployeeModule {}