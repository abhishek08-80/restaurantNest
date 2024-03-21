import {
    Delete,
    Inject,
    Injectable,
    forwardRef
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from 'src/employee/employee.service';
import { User } from './../user/user.entity';
import { mailTransporter } from 'src/email/email';

@Injectable()

export class AuthService {
    constructor(
        private jwtservice: JwtService,
        private employeeService: EmployeeService,
    ) {}



    async login(user) {
        const result: any = { data: [], metadata: null, error: [] }
        try {

            // let obj = {
            //     email:user?.email
            // }
            const isExist = await this.employeeService.findByAttribute(user)
            delete isExist?.password
            if (!isExist) {
                result.error = { message: "email or password do not match" }
                return result.error
            }
            const payload = { userId: isExist.id, role: isExist.role };
            return {
                access_token: this.jwtservice.sign(payload),
                employee: {
                    'email': isExist.email,
                    'address': isExist.address,
                    'firstName': isExist.firstName,
                    'role': isExist.role
                }

            };

        } catch (error) {
            return error
        }

    }

    validate(payload) {
        try {
            return { userId: payload.sub, username: payload.username };
        } catch (error) {
            return error
        }
    }


}

