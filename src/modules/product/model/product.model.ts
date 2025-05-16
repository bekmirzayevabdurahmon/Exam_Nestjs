import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ProductStatus } from "../enums";

@Table({ tableName: "products", timestamps: true })
export class Product extends Model{
    
@Column({ type: DataType.TEXT})
name: string;

@Column({ type: DataType.TEXT})
description: string;

@Column({ type: DataType.INTEGER})
price: number;

@Column({ type: DataType.INTEGER})
discount: number;

@Column({ type: DataType.INTEGER})
rating: number;

@Column({ type: DataType.INTEGER})
stock: number;

@Column({ type: DataType.ENUM,
    values: Object.values(ProductStatus),
    defaultValue: ProductStatus.ACTIVE,
})
status: string;

@Column({ type: DataType.TEXT})
image: string;
}