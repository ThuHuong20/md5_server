import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    [x: string]: any;
    @PrimaryGeneratedColumn('uuid')
    id: number;
    @Column("varchar", {
        unique: true,
        length: 50
    })
    title: string;

    @Column({ default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGYVzWTuDXyCf02RIHia-_X-mnkW_476LQjyc9tZfpOg&s" })
    avartar: string

    @Column({ default: false })
    status: Boolean;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[]
}
