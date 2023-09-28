import { Allow } from "class-validator";

export class CreateProductDto {
    @Allow()
    name: string

    @Allow()
    des: string

    @Allow()
    type: string

    @Allow()
    categoryId: string

    @Allow()
    avatar: string

    // @Allow()
    // price: string
}
