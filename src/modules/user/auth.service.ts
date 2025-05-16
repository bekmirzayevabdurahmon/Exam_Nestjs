import { ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./model/userModel";
import { JwtService } from "@nestjs/jwt";
import { registerDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs"
import { loginDto } from "./dtos";
import { UserRoles } from "./enums";

@Injectable()
export class AuthService implements OnModuleInit{
    constructor(
        @InjectModel(User) private userModel: typeof User,
        private jwtService: JwtService,
    ) {}

    async onModuleInit() {
        await this.seedUsers();
    }

    async seedUsers() {
    const defaultUsers = [
      {
        name: 'Abdurahmon',
        age: 25,
        email: 'abdurahmon@gmail.com',
        password: 'abdurahmon11',
        role: UserRoles.ADMIN,
      },
    ];

    for (const user of defaultUsers) {
      const foundUser = await this.userModel.findOne({
        where: { email: user.email },
      });

      if (!foundUser) {
        const passHash = bcrypt.hashSync(user.password, 10);
        await this.userModel.create({
          name: user.name,
          role: user.role,
          age: user.age,
          email: user.email,
          password: passHash,
        });
      }
    }

    console.log('Admin user created ✅');
  }

    async register(payload: registerDto) {
        await this.#_checkExistUserByEmail(payload.email)

        const passHash = bcrypt.hashSync(payload.password, 10);

        const user = await this.userModel.create({
            name: payload.name,
            email: payload.email,
            password: passHash,
        })

        console.log('User:', user.id, user.role);
        const accessToken = this.jwtService.sign({ id: user.id, role: user.role });
        console.log('Generated Access Token:', accessToken);

        return {
            message: "success",
            data: {
                user,
                accessToken,
            }
        }
    }

    async login(payload: loginDto) {
        const user = await this.#_checkUserByEmail(payload.email);

        console.log(user)
        if(!user) {
            throw new ConflictException("User paroli mavjuda emas")
        }

        // const accessToken = this.jwtService.sign({ id: user.id, role: user.role})

        return {
            message: "success",
            data: {
                user,
            }
        }
    }

    async #_checkExistUserByEmail(email: string) {
        const user = await this.userModel.findOne({ where: { email }})

        if(user) {
            throw new ConflictException(`Bunday email'lik user allaqachon bor`);
        }

        return true
    }

    async #_checkUserByEmail(email: string) {
        const user = await this.userModel.findOne({ where: { email }})

        if(!user) {
            throw new ConflictException(`Bunday emaillik user yo'q`)
        }

        return true
    }
}