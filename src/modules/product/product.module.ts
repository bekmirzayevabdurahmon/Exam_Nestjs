import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./model/product.model";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { FsHelper } from "src/helpers/fs.helper";

@Module({
    imports: [
        SequelizeModule.forFeature([Product]),
    ],
    controllers: [ProductController],
    providers: [ProductService, FsHelper]
})

export class ProductModule {}