import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOption } from './entities/product-option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductOptionService {
  constructor(
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
  ) { }
  async create(createProductOptionDto: CreateProductOptionDto) {
    try {
      let productOption = await this.productOptionRepository.save(createProductOptionDto)
      if (!productOption) return [false, "loi", null]
      let newOptionDetail = await this.productOptionRepository.findOne({
        where: {
          id: productOption.id
        }
      })
      if (!newOptionDetail) return [false, "loi", null]
      return [true, "Create Ok!", newOptionDetail]
    } catch (err) {
      return [false, "Lỗi model", null]
    }
  }

  async findAll() {
    try {
      let productOption = await this.productOptionRepository.find({

      })
      return {
        message: "get productOption success",
        data: productOption
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} productOption`;
  }

  update(id: number, updateProductOptionDto: UpdateProductOptionDto) {
    return `This action updates a #${id} productOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} productOption`;
  }
}
