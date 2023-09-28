
import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductOption {

    @PrimaryGeneratedColumn()
    id: number;


    @Column("varchar", {
        length: 50
    })
    price: string

    @Column("varchar", {
        length: 50
    })
    option: string

    @Column({
        default: false
    })
    status: boolean;

    @Column({ nullable: false })
    productId: string

    @ManyToOne(() => Product, (product) => product.productOption)
    product: Product

}