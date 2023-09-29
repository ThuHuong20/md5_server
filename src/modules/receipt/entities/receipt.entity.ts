import { Guest } from "src/modules/guest/entities/guest.entity";
import { User } from "src/modules/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReceiptDetail } from "./receipt-detail.entity";

export enum ReceiptStatus {
    SHOPPING = "SHOPPING",
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    SHIPPING = "SHIPPING",
    DONE = "DONE"
}


@Entity()
export class Receipt {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        nullable: false,
    })
    userId: string;

    @Column({
        nullable: false,
    })
    guestId: string

    @ManyToOne(() => User, (user) => user.receipts)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Guest, (guest) => guest.receipts)
    @JoinColumn({ name: "guestId" })
    guest: Guest;

    @Column({
        default: 0,
    })
    total: number;

    @Column({
        type: "enum",
        enum: ReceiptStatus,
        default: ReceiptStatus.SHOPPING
    })
    status: ReceiptStatus;

    @Column()
    createAt: string; // thoi gian tao down

    @Column()
    accepted: string; //shop xac nhan down hang

    @Column()
    shipAt: string; // thoi gian van chuyen

    @Column()
    done: string; // khach nhan dc down hang

    @BeforeInsert()
    hanldeSetCreateAt() {
        this.createAt = String(Date.now());
    }

    @OneToMany(() => ReceiptDetail, (receiptDetail) => receiptDetail.receipt)
    detail: ReceiptDetail[];
}
