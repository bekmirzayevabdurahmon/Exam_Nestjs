import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class createProductDto {
    @ApiProperty({
        type: 'string',
        required: true,
        example: 'Tomato'
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'Delicius and red tomato'
    })
    @IsString()
    description: string;

    @Transform(({value}) => {return parseInt(value)})    
    @ApiProperty({
        type: 'number',
        required: true,
        example: '12000'
    })
    @IsNumber()
    price: number;

    @Transform(({value}) => {return parseInt(value)})    
    @ApiProperty({
        type: 'number',
        required: true,
        example: 20
    })
    @IsNumber()
    discount: number;

    @Transform(({value}) => {return parseInt(value)})
    @ApiProperty({
        type: 'number',
        required: true,
        example: 5
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @Transform(({value}) => {return parseInt(value)})
    @ApiProperty({
        type: 'number',
        required: true,
        example: 10
    })
    @IsNumber()
    stock: number;

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'ACTIVE'
    })
    @IsString()
    status: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Rasmni fayl sifatida yuklang'
    })
    @IsOptional()
    image?: any;
}