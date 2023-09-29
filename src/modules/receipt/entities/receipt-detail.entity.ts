import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Receipt } from "./receipt.entity";
import { ProductOption } from "src/modules/product-option/entities/product-option.entity";

@Entity()
export class ReceiptDetail {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    receiptId: string;

    @ManyToOne(() => Receipt, (receipt) => receipt.detail)
    @JoinColumn({ name: "receiptId" })
    receipt: Receipt;

    @Column()
    optionId: string;

    @ManyToOne(() => ProductOption, (ProductOption) => ProductOption.sold)
    @JoinColumn({ name: "optionId" })
    option: ProductOption;

    @Column()
    quantity: number

}