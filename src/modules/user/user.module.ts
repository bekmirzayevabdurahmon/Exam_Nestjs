import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./model/userModel";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        JwtModule.register({
            secret: "secret-key",
            signOptions: {expiresIn: '1h'}
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService]
})

export class UserModule {}