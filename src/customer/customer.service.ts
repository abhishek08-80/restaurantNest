import {
  Inject,
  Injectable, forwardRef
} from '@nestjs/common';
import {
  InjectModel
} from '@nestjs/mongoose';
import {
  Model
} from 'mongoose';
import {
  CreateCustomerDto
} from '../dto/customer.dto';
import {
  UpdateDto
} from '../dto/auth.dto';
import {
  LoginDto
} from '../dto/auth.dto';
import {
  Customer,
  CustomerDocument
} from '../model/customer.model';
import * as bcrypt from 'bcrypt';
// import { count } from 'console';
import { mailTransporter } from 'src/email/email';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class CustomerService {

  constructor(@InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>

  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDocument> {
    const result: any = { data: [], metadata: null, error: [] }

    try {
      const { email, password } = createCustomerDto;
      const existingUser: CreateCustomerDto = await this.customerModel.findOne({ email })
      if (existingUser) {
        result.error = { message: "employee with this email already exists" }
        return result
      }
      if (!existingUser) {
        const customer = new this.customerModel(createCustomerDto);
        const pass = await this.hashPassword(password)
        customer.password = pass

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

        return await customer.save()
      }
    } catch (error) {
      console.log(error)
      return error
    }
  }





  async findAll(model: any): Promise<CustomerDocument[]> {
    const result: any = { data: [], metadata: [], error: null }

    try {
      const page = model.page
      const search = model.search
      let limit = model.limit;
      if (!limit) {
        limit = 2
      }
      if (search == undefined) {
        result.data = await this.customerModel.find().limit(limit).skip((page - 1) * limit).sort({ firstName: -1 });
      }
      else {
        result.data = await this.customerModel.find(
          {
            '$or': [
              { 'firstName': { $regex: model.search } },
              { 'email': { $regex: model.search } },
              { 'address': { $regex: model.search } }
            ]
          }
        ).limit(limit).skip((page - 1) * limit).sort({ firstName: -1 });

      }
      result.metadata = await this.customerModel.countDocuments()

      return result

    } catch (error) {
      throw error
    }
  }




  async findOne(id: string) {
    return this.customerModel.findById(id);
  }
  /**
   * @param id 
   * @param updateEmployeeDto 
   * @returns 
   * @description: this is used update the 
   *
   */

  async updateDetails(id: string, updateDto: UpdateDto): Promise<CustomerDocument> {
    const result: any = { data: [], metadata: null, error: [] }

    try {
      const { hobbies,password, ...rest } = updateDto;
      if(password){
        result.error = { message: "updating password is not allowed" }
        return result
      }
      const existingUser = await this.customerModel.findOne({ _id: id }).lean()
      if (!existingUser) {
        result.error = { message: "user does not exists" }
        return result
      }
      const updatedHobbies = [...existingUser.hobbies, ...updateDto.hobbies];

      const finalobj = { ...updatedHobbies, ...rest }
      console.log(finalobj)
      return await this.customerModel.findByIdAndUpdate(id, { $set: (finalobj) }, { new: true });
    } catch (error) {
      console.log(error)
      return error
    }
  }



  async changePassword(updateDto: UpdateDto): Promise<CustomerDocument> {
    const result: any = { data: [], metadata: null, error: [] }

    try {
      const { email, oldPassword, newPassword, confirmPassword } = updateDto;


      if (newPassword !== confirmPassword) {
        result.error = { message: "new password and confirm password do not match" }
        return result
      }
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(oldPassword, saltOrRounds);

      const existingUser = await this.customerModel.findOne({ email });
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

  async resetPassword(updateDto: UpdateDto): Promise<CustomerDocument> {
    const result: any = { data: [], metadata: null, error: [] }
    try {
      const { email, otp, newPassword, confirmPassword }: any = updateDto;

      if (newPassword !== confirmPassword) {
        result.error = { message: "new password and confirm password do not match" }
        return result
      }

      const existingUser = await this.customerModel.findOne({ email });
      if (!existingUser) {
        result.error = { message: "user with this email does not exists" }
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
      const findEmployee = this.customerModel.findOne({ id })
      if (!findEmployee) {
        result.error = { message: "employee does not exists" }
        return result
      }
      const removeEmployee = this.customerModel.findByIdAndDelete(id);

    } catch (error) {
      return error
    }
  }


  async forgetPasswordEmail(createEmployeeDto: CreateCustomerDto): Promise<CustomerDocument> {
    const result: any = { data: [], metadata: null, error: [] }
    try {
      const { email } = createEmployeeDto;

      const existingUser = await this.customerModel.findOne({ email });
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

  async findByAttribute(loginDto: LoginDto): Promise<CustomerDocument> {  
    try { 
      const {email, password} = loginDto 
      
      const existingUser = await this.customerModel.findOne({email}).lean()
      if (!existingUser) {
        return null
      }
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return null
      }
      return this.customerModel.findByIdAndUpdate(existingUser);
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