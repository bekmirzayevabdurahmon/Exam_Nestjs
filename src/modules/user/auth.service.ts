import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./model/userModel";
import { JwtService } from "@nestjs/jwt";
import { registerDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs"
import { loginDto } from "./dtos";

@Injectable()
export class AuthService{
    constructor(
        @InjectModel(User) private userModel: typeof User,
        private jwtService: JwtService,
    ) {}

    async register(payload: registerDto) {
        this.#_checkExistUserByEmail(payload.email)

        const passHash = bcrypt.hashSync(payload.password, 10);

        const user = await this.userModel.create({
            name: payload.name,
            email: payload.email,
            password: passHash
        })

        const accessToken = this.jwtService.sign({ id: user.id, role: user.role})

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