import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { registerDto } from "./dtos/register.dto";
import { loginDto } from "./dtos";

@Controller()
export class AuthController {
    constructor(private service: AuthService) {}

    @Post('register')
    async Register(@Body() payload: registerDto) {
        return await this.service.register(payload)
    }

    @Post('login')
    async Login(@Body() payload: loginDto) {
        return await this.service.login(payload)
    }
}