import { Allow } from "class-validator";

export class CreateCategoryDto {
    @Allow()
    title: string

}
