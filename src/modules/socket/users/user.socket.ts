import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Client } from "discord.js";
import { Server, Socket } from 'socket.io'
import { User } from "src/modules/users/entities/user.entity";
import { JwtService } from "src/utils/jwt";
interface ClientType {
    user: User,
    socket: Socket
}

@WebSocketGateway(3001, { cors: true })
export class UserSocketGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server

    clients: ClientType[] = []
    constructor(private readonly jwt: JwtService) { }
    onModuleInit() {
        this.server.on("connect", (socket: Socket) => {
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
                if (this.clients.find(client => client.user.id == user.id)) {
                    socket.emit("connectStatus", {
                        message: "Signed in on another device!",
                        status: true
                    })
                    socket.disconnect()
                    return
                }
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

            }
        })
    }
}