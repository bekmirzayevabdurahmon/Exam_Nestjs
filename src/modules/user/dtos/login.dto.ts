import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class loginDto {

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'peter@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'peter1234'
    })
    @MinLength(8)
    @MaxLength(20)
    @IsString()
    password: string;
}