import { Module } from "@nestjs/common";
import { DiscordBotSocket } from "./discord.bot.socket";
import { CustomerChatSocket } from "./customer.chat.socket";
import { CustomerChatService } from "./customers/customer.chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerChats } from "./customers/entities/customer.chat.entity";
import { JwtService } from "src/utils/jwt";
import { UserSocketGateway } from "./users/user.socket";
import { Receipt } from "../receipt/entities/receipt.entity";
import { ReceiptDetail } from "../receipt/entities/receipt-detail.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([CustomerChats, Receipt, ReceiptDetail])
    ],
    providers: [DiscordBotSocket, CustomerChatSocket, CustomerChatService, JwtService, UserSocketGateway]
})
export class SocketModule { }