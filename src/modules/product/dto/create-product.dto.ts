import { Allow } from "class-validator";

export class CreateProductDto {
    @Allow()
    name: string

    @Allow()
    des: string

    // @Allow()
    // price: string
}
