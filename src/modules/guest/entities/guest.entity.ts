import { Receipt } from "src/modules/receipt/entities/receipt.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Guest {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    phoneNumber: string;

    @Column()
    email: string

    @OneToMany(() => Receipt, (receipt) => receipt.guest)
    receipts: Receipt[];
}
