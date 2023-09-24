import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Allow } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class UpdateProductDto extends PartialType(CreateProductDto) {

    @Allow()
    name: string

    @Allow()
    des: string

    // @Allow()
    // price: string
}


