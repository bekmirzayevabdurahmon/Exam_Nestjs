import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { createProductDto } from "./dtos";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "src/pipes";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { Protected, Roles } from "src/decorators";
import { UserRoles } from "../user";

@Controller()
export class ProductController{
    constructor(
        private service: ProductService
    ) {}

    @Get()
    @Protected(false)
    @Roles([UserRoles.ADMIN, UserRoles.USER])
    async getAll(){
        return await this.service.getAll()
    }

    @Get(':id')
    @Protected(false)
    @Roles([UserRoles.ADMIN, UserRoles.USER])
    async getById(@Param('id', ParseIntPipe) id: number) {
        return await this.service.getById(id)
    }

    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    @Post() 
    async create(
        @Body() payload: createProductDto,
        @UploadedFile(new FileValidationPipe()) file?: Express.Multer.File){
            return await this.service.create(payload, file)
    }

    @Patch(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateProductDto) {
        return await this.service.update(id, payload);
    }

    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    @Put(':id/image')
    async updateImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        return await this.service.updateImage(id, file);
    }


    @Delete(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id)
    }
}