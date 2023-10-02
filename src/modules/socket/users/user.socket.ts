import { OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Client } from "discord.js";
import { type } from "os";
import { Server, Socket } from 'socket.io'
import { ReceiptDetail } from "src/modules/receipt/entities/receipt-detail.entity";
import { Receipt, ReceiptStatus } from "src/modules/receipt/entities/receipt.entity";
import { User } from "src/modules/users/entities/user.entity";
import { JwtService } from "src/utils/jwt";
import { Not, Repository } from "typeorm";
interface ClientType {
    user: User,
    socket: Socket
}

@WebSocketGateway(3001, { cors: true })
export class UserSocketGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server

    clients: ClientType[] = []
    constructor(
        private readonly jwt: JwtService,
        @InjectRepository(Receipt) private readonly receipts: Repository<Receipt>,
        @InjectRepository(ReceiptDetail) private readonly receiptDetail: Repository<ReceiptDetail>
    ) { }
    onModuleInit() {
        this.server.on("connect", async (socket: Socket) => {
            console.log("da co nguoi connect");

            /* xoa nguoi dug khoi client neu disconnect */
            socket.on("disconnect", () => {
                this.clients = this.clients.filter(client => client.socket.id != socket.id)
            })
            /* xac thuwc nguoi dung */
            let token: string = String(socket.handshake.query.token);
            let user = (this.jwt.verifyToken(token) as User);


            if (token == "undefined" || !user) {
                socket.emit("connectStatus", {
                    message: "Login failed",
                    status: false
                })
                socket.disconnect();
            } else {
                // if (this.clients.find(client => client.user.id == user.id)) {
                //     socket.emit("connectStatus", {
                //         message: "Signed in on another device!",
                //         status: true
                //     })
                //     socket.disconnect()
                //     return
                // }
                /* luu tru thong tin nguoi dung vua ket noi de tuong tac ve sau */
                this.clients.push({
                    socket,
                    user
                })
                socket.emit("connectStatus", {
                    message: "Login Successfully",
                    status: true
                })
                socket.emit("receiveUserData", user)

                let receipt = await this.findReceiptByAuthId({
                    userId: user.id,
                    guestId: null
                });


                socket.emit("receiveReceipt", receipt ? receipt : [])

                let cart = await this.getCartByUserId(user.id);
                if (cart) {
                    socket.emit("receiveCart", cart)
                }

                socket.on("addToCart", async (newItem: { receiptId: string, optionId: string, quantity: number }) => {
                    let cart = await this.addToCart(newItem)
                    if (cart) {// khi mua hang thi may khac cung nhan duoc thong bao
                        for (let i in this.clients) {
                            if (this.clients[i].user.id == user.id) {
                                this.clients[i].socket.emit("receiveCart", cart)
                            }
                        }
                        socket.emit("receiveCart", cart)
                    }

                })

                socket.on("payCash", async (data: {
                    receiptId: string,
                    userId: string
                }) => {
                    console.log("data", data);
                    let cashInfor = await this.cash(data.receiptId, data.userId)
                    if (cashInfor) {
                        for (let i in this.clients) {
                            if (this.clients[i].user.id == user.id) {
                                this.clients[i].socket.emit("receiveCash", cashInfor[0])
                                this.clients[i].socket.emit("receiveReceipt", cashInfor[1])
                                this.clients[i].socket.emit("cash-status", true)
                            }
                        }
                    }
                })


                socket.on("deleteItemFromCart", async (newItem: { receiptId: string, optionId: string }) => {
                    let cart = await this.deleteItemFromCart(newItem);
                    if (cart) {
                        socket.emit("receiveCart", cart)
                    }
                })
            }
        })
    }
    async findReceiptByAuthId(data: {
        userId: string | null,
        guestId: string | null
    }) {
        try {


            if (data.userId == null && data.guestId == null) return false
            let receipts = await this.receipts.find({
                where: data.userId ? {
                    userId: data.userId,
                    status: Not(ReceiptStatus.SHOPPING)
                } : {
                    guestId: data.guestId,
                    status: Not(ReceiptStatus.SHOPPING)
                },
                relations: {
                    detail: {
                        option: {
                            product: {
                                productOption: true
                            }
                        }
                    }
                }
            })


            if (!receipts) return false
            if (receipts.length == 0) return false
            return receipts
        } catch (err) {
            return false
        }
    }

    async getCartByUserId(userId: string) {
        try {
            let oldCart = await this.receipts.find({
                where: {
                    userId,
                    status: ReceiptStatus.SHOPPING
                },
                relations: {
                    detail: {
                        option: {
                            product: {
                                productOption: true
                            }
                        }
                    }
                }
            })
            if (!oldCart || oldCart.length == 0) { // neu tim gio han cu bi loi

                // tao gio hang
                let newCartChema = this.receipts.create({
                    userId,
                })
                let newCart = await this.receipts.save(newCartChema);

                if (!newCart) return false
                let newCartRelation = this.receipts.findOne({
                    where: {
                        id: newCart.id
                    },
                    relations: {
                        detail: {
                            option: {
                                product: true
                            }
                        }
                    }

                })
                if (!newCartRelation) return false
                return newCartRelation
            }
            return oldCart[0]
        } catch (err) {
            console.log("err:", err)
            return false
        }
    }

    async addToCart(newItem: { receiptId: string, optionId: string, quantity: number }) {
        try {
            let items = await this.receiptDetail.find({
                where: {
                    receiptId: newItem.receiptId
                }
            })
            if (!items) return false
            if (items.length == 0) {
                this.receiptDetail.save(newItem)
            } else {
                let check = items.find(item => item.optionId == newItem.optionId)
                if (check) {
                    let itemUpdate = this.receiptDetail.merge(items.find(item => item.optionId == newItem.optionId), {
                        quantity: newItem.quantity
                    })
                    await this.receiptDetail.save(itemUpdate)
                } else {
                    await this.receiptDetail.save(newItem)
                }


            }
            let cart = await this.receipts.findOne({
                where: {
                    id: newItem.receiptId
                },
                relations: {
                    detail: {
                        option: {
                            product: {
                                productOption: true
                            }
                        }
                    }
                }
            })
            if (!cart) return false
            return cart
        } catch (err) {
            console.log("err:", err)
            return false;
        }
    }

    async cash(receiptId: string, userId: string) {
        try {
            let nowCart = await this.receipts.findOne({
                where: {
                    id: receiptId
                }
            })
            if (!nowCart) return false
            let cartUpdate = this.receipts.merge(nowCart, {
                status: ReceiptStatus.PENDING
            })
            let cartResult = await this.receipts.save(cartUpdate);
            if (!cartResult) return false

            // tao cart moiw
            let newCart = await this.getCartByUserId(userId);
            if (!newCart) return false
            let receipts = await this.receipts.find({
                where: {
                    userId,
                    status: Not(ReceiptStatus.SHOPPING)
                },
                relations: {
                    detail: {
                        option: {
                            product: {
                                productOption: true
                            }
                        }
                    }
                }
            })
            if (!receipts) return false
            return [newCart, receipts]

        } catch (err) {
            return false
        }
    }

    async deleteItemFromCart(newItem: { receiptId: string, optionId: string }) {
        try {
            const { receiptId, optionId } = newItem;

            // Xóa mục từ giỏ hàng
            await this.receiptDetail.delete({
                receiptId,
                optionId
            });

            // Lấy lại thông tin giỏ hàng sau khi xóa
            let cart = await this.receipts.findOne({
                where: {
                    id: receiptId
                },
                relations: {
                    detail: {
                        option: {
                            product: {
                                productOption: true
                            }
                        }
                    }
                }
            });

            if (!cart) return false;
            return cart;
        } catch (err) {
            return false;
        }
    }
}