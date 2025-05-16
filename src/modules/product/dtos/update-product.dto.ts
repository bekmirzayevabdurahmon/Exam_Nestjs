import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({
        type: 'string',
        required: true,
        example: 'Updated Tomato'
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: 'string',
        required: true,
        example: 'Updated delicious red tomato'
    })
    @IsString()
    description: string;

    @Transform(({value}) => {return parseInt(value)})    
    @ApiProperty({
        type: 'number',
        required: true,
        example: 15000
    })
    @IsNumber()
    price: number;

    @Transform(({value}) => {return parseInt(value)})    
    @ApiProperty({
        type: 'number',
        required: true,
        example: 25
    })
    @IsNumber()
    discount: number;

    @Transform(({value}) => {return parseInt(value)})
    @ApiProperty({
        type: 'number',
        required: true,
        example: 4
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @Transform(({value}) => {return parseInt(value)})
    @ApiProperty({
        type: 'number',
        required: true,
        example: 15
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
}