import { Category } from "src/modules/categories/entities/category.entity";
import { ProductOption } from "src/modules/product-option/entities/product-option.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: string;
    @Column("varchar", {
        unique: true,
        length: 50
    })
    name: string;

    @Column("varchar", {
        length: 250
    })
    des: string;


    @Column("varchar", {
        length: 50
    })
    type: string;

    // @Column("varchar", {
    //     length: 50
    // })
    // price: string

    @Column({ default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGYVzWTuDXyCf02RIHia-_X-mnkW_476LQjyc9tZfpOg&s" })
    avatar: string

    @Column({ default: false })
    active: Boolean;

    @Column({ nullable: false })
    categoryId: String;

    // @Column({ nullable: false })
    // productId: string

    @ManyToOne(() => Category, (category) => category.products)
    category: Category

    @OneToMany(() => ProductOption, (productOption) => productOption.product)
    productOption: ProductOption[]
}
