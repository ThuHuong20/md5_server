import { Allow, IsEmail, Length } from "class-validator";

export class CreateUserDto {
    @Allow()
    userName: string;

    @Allow()
    @IsEmail()
    email: string;

    @Allow()
    @Length(6, 20)
    password: string;
}
