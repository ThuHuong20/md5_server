
import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductOption {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    // @Column("varchar", {
    //     unique: true,
    //     length: 50
    // })
    // name: string;

    @Column("varchar", {
        length: 50
    })
    price: string


    // @Column({ nullable: false })
    // categoryId: string

    @ManyToOne(() => Product, (product) => product.productOption)
    product: Product

}