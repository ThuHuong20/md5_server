import { Module } from "@nestjs/common";
import { DiscordBotSocket } from "./discord.bot.socket";
import { CustomerChatSocket } from "./customer.chat.socket";
import { CustomerChatService } from "./customers/customer.chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerChats } from "./customers/entities/customer.chat.entity";
import { JwtService } from "src/utils/jwt";


@Module({
    imports: [
        TypeOrmModule.forFeature([CustomerChats])
    ],
    providers: [DiscordBotSocket, CustomerChatSocket, CustomerChatService, JwtService]
})
export class SocketModule { }