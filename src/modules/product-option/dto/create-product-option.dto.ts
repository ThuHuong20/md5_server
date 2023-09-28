import { Allow } from "class-validator"

export class CreateProductOptionDto {
    @Allow()
    option: string

    @Allow()
    price: string

    @Allow()
    productId: string
}
