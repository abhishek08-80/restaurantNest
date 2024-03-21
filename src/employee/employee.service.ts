import {
  Injectable
} from '@nestjs/common';
import {
  InjectModel
} from '@nestjs/mongoose';
import {
  Model
} from 'mongoose';
import {
  CreateEmployeeDto
} from '../dto/create-employee.dto';
import {
  UpdateEmployeeDto
} from '../dto/create-employee.dto';
import {
  LoginEmployeeDto
} from '../dto/login-employee.dto';
import {
  Employee,
  EmployeeDocument
} from '../model/employee.model';
import * as bcrypt from 'bcrypt';
// import { count } from 'console';
import { mailTransporter } from 'src/email/email';


@Injectable()
export class EmployeeService {

  constructor(@InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDocument> {
    const result: any = { data: [], metadata: null, error: [] }

    try {
      const { email, password } = createEmployeeDto;
      const existingUser: CreateEmployeeDto = await this.employeeModel.findOne({ email })
      if (existingUser) {
        result.error = { message: "employee with this email already exists" }
        return result
      }
      if (!existingUser) {
        const employee = new this.employeeModel(createEmployeeDto);
        const pass = await this.hashPassword(password)
        employee.password = pass

        const mailDetails = {
          // from: '',
          to: email,
          subject: 'Account created.',
          text: 'Your account has been successfully created.',
        }
        console.log(mailDetails)
        mailTransporter.sendMail(mailDetails, function (err, data) {
          if (err) {
            console.log('Error:Email not Sent', err)
          } else {
            console.log('Email sent successfully');
          }
        });

        return await employee.save()
      }
    } catch (error) {
      return error
    }
  }

  async findAll(model: any): Promise<EmployeeDocument[]> {
    const result: any = { data: [], metadata: [], error: null }

    try {
      const page = model.page
      const search = model.search
      let limit = model.limit;
      if (!limit) {
        limit = 2
      }
      if (search == undefined) {
        result.data = await this.employeeModel.find().limit(limit).skip((page - 1) * limit).sort({ firstName: -1 });
      }
      else {
        result.data = await this.employeeModel.find(
          {
            '$or': [
              { 'firstName': { $regex: model.search } },
              { 'email': { $regex: model.search } },
              { 'address': { $regex: model.search } }
            ]
          }
        ).limit(limit).skip((page - 1) * limit).sort({ firstName: -1 });

      }
      result.metadata = await this.employeeModel.countDocuments()

      return result

    } catch (error) {
      throw error
    }
  }




  async findOne(id: string) {
    return this.employeeModel.findById(id);
  }
  /**
   * @param id 
   * @param updateEmployeeDto 
   * @returns 
   * @description: this is used update the 
   *
   */

  async updateDetails(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeDocument> {
    const result: any = { data: [], metadata: null, error: [] }

    try {
      const { hobbies, ...rest } = updateEmployeeDto;
      const existingUser = await this.employeeModel.findOne({ _id: id }).lean()
      if (!existingUser) {
        result.error = { message: "Employee does not exists" }
        return result
      }
      const updatedHobbies = [...existingUser.hobbies, ...updateEmployeeDto.hobbies];

      const finlaobj = { ...updatedHobbies, ...rest }
      console.log(finlaobj, 'dddddd')
      return await this.employeeModel.findByIdAndUpdate(id, { $set: (finlaobj) }, { new: true });
    } catch (error) {
      console.log(error)
      return error
    }
  }



  async changePassword(updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeDocument> {
    const result: any = { data: [], metadata: null, error: [] }

    try {
      const { email, oldPassword, newPassword, confirmPassword } = updateEmployeeDto;


      if (newPassword !== confirmPassword) {
        result.error = { message: "new password and confirm password do not match" }
        return result
      }
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(oldPassword, saltOrRounds);

      const existingUser = await this.employeeModel.findOne({ email });
      if (!existingUser) {
        result.error = { message: "employee with this email does not exists" }
        return result
      }
      console.log(existingUser)
      const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
      if (!isMatch) {
        result.error = { message: "old password is incorrect" }
        return result
      }
      existingUser.password = newPassword;
      const pass = await this.hashPassword(newPassword)
      existingUser.password = pass
      await existingUser.save();

      return existingUser

    } catch (error) {
      throw error;
    }
  }

  async resetPassword(updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeDocument> {
    const result: any = { data: [], metadata: null, error: [] }
    try {
      const { email, otp, newPassword, confirmPassword }: any = updateEmployeeDto;

      if (newPassword !== confirmPassword) {
        result.error = { message: "new password and confirm password do not match" }
        return result
      }

      const existingUser = await this.employeeModel.findOne({ email });
      if (!existingUser) {
        result.error = { message: "employee with this email does not exists" }
        return result
      }

      const originalOtp = await existingUser.otp
      if (originalOtp !== otp) {
        result.error = { message: "incorrect otp" }
        return result
      }
      const otpExpiration = existingUser.otpExpiration
      if (otpExpiration < Date.now()) {
        result.error = { message: "otp expired" }
        return result
      }
      console.log(otpExpiration, Date.now())
      const pass = await this.hashPassword(newPassword)
      existingUser.password = pass
      existingUser.otp = undefined
      existingUser.password = newPassword;
      await existingUser.save();

      const mailDetails = {
        // from: '',
        to: email,
        subject: 'Password Changed',
        text: 'Your account password updated successfully',
      }
      console.log(mailDetails)
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log('Error:Email not Sent', err)
        } else {
          console.log('Email sent successfully');
        }
      });

      result.data = 'Password updated successfully'
      return result;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const result: any = { data: [], metadata: null, error: [] }
    try {
      const findEmployee = this.employeeModel.findOne({ id })
      if (!findEmployee) {
        result.error = { message: "employee does not exists" }
        return result
      }
      const removeEmployee = this.employeeModel.findByIdAndDelete(id);

    } catch (error) {
      return error
    }
  }


  async forgetPasswordEmail(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDocument> {
    const result: any = { data: [], metadata: null, error: [] }
    try {
      const { email } = createEmployeeDto;

      const existingUser = await this.employeeModel.findOne({ email });
      if (!existingUser) {
        result.error = { message: "employee with this email does not exists" }
        return result
      }
      // const floor = Math.floor(max)
      const otp = Math.floor(Math.random() * 999999)
      console.log(otp)
      const otpExpiration = Date.now() + 600000;
      const mailDetails = {
        // from: '', 
        to: existingUser?.email,
        subject: 'Request for password reset.',
        text: `You have received a one-time password (OTP) for updating your password. The otp is ${otp} and will expire in the next 10 minutes.`,
      }
      console.log(mailDetails)
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log('Error:Email not Sent', err)
        } else {
          console.log('Email sent successfully');
        }
      });
      console.log(otpExpiration)
      existingUser.otp = otp
      existingUser.otpExpiration = otpExpiration
      await existingUser.save();

      return existingUser;
    } catch (error) {
      throw error;
    }
  }

  // async findByAttributeId(loginEmployeeDto: LoginEmployeeDto): Promise<EmployeeDocument> {
  //   try {
  //     console.log(loginEmployeeDto)
  //     const existingUser = await this.employeeModel.findOne(loginEmployeeDto).lean()
  //     if (!existingUser) {
  //       return null
  //     }
  //     return this.employeeModel.findByIdAndUpdate(existingUser);
  //   } catch (error) {
  //     return error
  //   }
  // }

  async findByAttribute(loginEmployeeDto: LoginEmployeeDto): Promise<EmployeeDocument> {
    try {
      console.log(loginEmployeeDto)
      const existingUser = await this.employeeModel.findOne(loginEmployeeDto).lean()
      if (!existingUser) {
        return null
      }
      return this.employeeModel.findByIdAndUpdate(existingUser);
    } catch (error) {
      return error
    }
  }


  async hashPassword(password) {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);

      return hashedPassword
    } catch (error) {
      return error
    }
  }


  async sendEmail(mailDetails) {
    try {
      console.log(mailDetails)
      mailDetails.subject = 'Account created Successfully'
      mailDetails.text = 'Your account was created successfully'
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log('Error:Email not Sent', err)
        } else {
          console.log('Email sent successfully');
        }
      });
    } catch (error) {
      console.log('Error: Email not Send!!')
    }
  }
}