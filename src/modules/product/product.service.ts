import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { v4 as uuid4 } from "uuid"
import * as path from "node:path"
import * as fs from "node:fs"
import { FsHelper } from "src/helpers/fs.helper";
import { Product } from "./model/product.model";
import { createProductDto } from "./dtos";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ProductStatus } from "./enums";

@Injectable()
export class ProductService implements OnModuleInit{
    constructor(
        @InjectModel(Product) private productModel: typeof Product,
        private fsHelper: FsHelper,
    ) {}

    async onModuleInit() {
        await this.seedProducts()
    }

    async seedProducts() {
    const defaultProducts = [{"name":"Corn Syrup","description":"error: no such column: grocery","price":7777,"discount":45,"rating":3,"stock":67,"status":"ACTIVE"},
    {"name":"Sultanas","description":"error: no such column: grocery","price":37819,"discount":58,"rating":1,"stock":27,"status":"OUT_OF_STOCK"},
    {"name":"Flavouring - Raspberry","description":"error: no such column: grocery","price":15293,"discount":52,"rating":5,"stock":51,"status":"INACTIVE"},
    {"name":"Curry Powder Madras","description":"error: no such column: grocery","price":32339,"discount":72,"rating":2,"stock":39,"status":"ACTIVE"},
    {"name":"Container - Clear 16 Oz","description":"error: no such column: grocery","price":38069,"discount":23,"rating":1,"stock":84,"status":"OUT_OF_STOCK"},
    {"name":"Green Tea Refresher","description":"error: no such column: grocery","price":38599,"discount":25,"rating":2,"stock":64,"status":"INACTIVE"},
    {"name":"Pie Filling - Pumpkin","description":"error: no such column: grocery","price":27662,"discount":30,"rating":4,"stock":87,"status":"INACTIVE"},
    {"name":"Water - Aquafina Vitamin","description":"error: no such column: grocery","price":18988,"discount":64,"rating":1,"stock":26,"status":"ACTIVE"},
    {"name":"Potatoes - Idaho 100 Count","description":"error: no such column: grocery","price":11888,"discount":14,"rating":1,"stock":4,"status":"ACTIVE"},
    {"name":"Hinge W Undercut","description":"error: no such column: grocery","price":34716,"discount":86,"rating":5,"stock":20,"status":"OUT_OF_STOCK"},
    {"name":"Coffee - Espresso","description":"error: no such column: grocery","price":29701,"discount":10,"rating":2,"stock":64,"status":"ACTIVE"},
    {"name":"Wine - Acient Coast Caberne","description":"error: no such column: grocery","price":34249,"discount":23,"rating":3,"stock":54,"status":"OUT_OF_STOCK"},
    {"name":"Skirt - 24 Foot","description":"error: no such column: grocery","price":9236,"discount":50,"rating":2,"stock":94,"status":"INACTIVE"},
    {"name":"Sherbet - Raspberry","description":"error: no such column: grocery","price":28776,"discount":67,"rating":4,"stock":10,"status":"INACTIVE"},
    {"name":"Puree - Blackcurrant","description":"error: no such column: grocery","price":25204,"discount":22,"rating":5,"stock":17,"status":"INACTIVE"},
    {"name":"Sugar - Icing","description":"error: no such column: grocery","price":30174,"discount":79,"rating":5,"stock":23,"status":"OUT_OF_STOCK"},
    {"name":"Glove - Cutting","description":"error: no such column: grocery","price":11572,"discount":80,"rating":1,"stock":66,"status":"ACTIVE"},
    {"name":"Rice - Basmati","description":"error: no such column: grocery","price":31300,"discount":66,"rating":5,"stock":89,"status":"OUT_OF_STOCK"},
    {"name":"Parasol Pick Stir Stick","description":"error: no such column: grocery","price":25309,"discount":11,"rating":2,"stock":88,"status":"OUT_OF_STOCK"},
    {"name":"Beef - Rib Roast, Capless","description":"error: no such column: grocery","price":11994,"discount":85,"rating":5,"stock":39,"status":"ACTIVE"}]

    for (const prod of defaultProducts) {
      const exist = await this.productModel.findOne({
        where: { name: prod.name },
      });

      if (!exist) {
        await this.productModel.create(prod);
      }
    }

    console.log('products created ✅');
    }

    async getAll() {
        const products = await this.productModel.findAll()
        if(!products){
            throw new NotFoundException("Xali product lar mavjud emas")
        }

        return {
            message: "success",
            data: {
                products,
            }
        }
    }

    async getById(id: number) {
        const product = await this.productModel.findByPk(id)

        if(!product){
            throw new NotFoundException("Bunday product mavjud emas")
        }

        return {
            message: "success",
            data: {
                product,
            }
        }
    }

    async create(payload: createProductDto, file?: Express.Multer.File) {
        try {
           let imageName: string | undefined;
        if (file) {
            const uploadDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const randomName = uuid4();
            const ext = path.extname(file.originalname);
            const fileName = `${randomName}${ext}`;
            const uploadPath = path.join(uploadDir, fileName);
            fs.writeFileSync(uploadPath, file.buffer);
            imageName = fileName;
        }
        console.log(imageName)
        const product = await this.productModel.create({
            name: payload.name,
            description: payload.description,
            price: payload.price,
            discount: payload.discount,
            rating: payload.rating,
            stock: payload.stock,
            status: payload.status,
            image: imageName,
        });

        console.log(product)

        console.log(imageName)

        return {
            message: "success",
            data: product
        }
        } catch (error) {
            console.log(error)
        }
    }

    async update(id: number, payload: UpdateProductDto) {
        const product = await this.productModel.findByPk(id);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        // Image maydonini yangilamaslik uchun o'chirib tashlaymiz
        const { image, ...updateData } = product.toJSON();
        const updatedProduct = await product.update({
            ...updateData,
            ...payload, // Yangi ma'lumotlar
        });

        return {
            message: "success",
            data: updatedProduct,
        };
    }

    async updateImage(id: number, file: Express.Multer.File) {
    const product = await this.productModel.findByPk(id);

    if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (product.image) {
        const oldImagePath = path.join(uploadDir, path.basename(product.image));
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }

    const randomName = uuid4();
    const ext = path.extname(file.originalname);
    const fileName = `${randomName}${ext}`;
    const uploadPath = path.join(uploadDir, fileName);
    fs.writeFileSync(uploadPath, file.buffer);

    await product.update({ image: fileName });

    return {
        message: "success",
        data: product,
    };
    }

    async delete(id: number) {
    const foundedProduct = await this.productModel.findByPk(id);

    if (!foundedProduct) throw new NotFoundException('Product topilmadi');

    if (foundedProduct.image) {
      await this.fsHelper.removeFiles(foundedProduct.image);
    }

    await this.productModel.destroy({ where: { id } });

    return {
      message: "O'chirildi",
      data: foundedProduct,
    };
    }
} 