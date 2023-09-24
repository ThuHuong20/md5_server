import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }
  async create(createProductDto: CreateProductDto) {
    try {
      let product = await this.productRepository.save(createProductDto)
      return {
        message: "success",
        data: product
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      let products = await this.productRepository.find()
      return {
        message: "get product success",
        data: products
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: string) {
    try {
      let product = await this.productRepository.findOne({ where: { id } })
      return {
        message: "get product success",
        data: product
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // try {
    //   const updatedProduct = await this.productRepository.update(id, updateProductDto);
    //   console.log("🚀 ~ file: product.service.ts:75 ~ ProductService ~ update ~ updatedProduct:", updatedProduct)
    //   if (updatedProduct.affected > 0) {
    //     const updatedProduct = await this.productRepository.findOne({ where: { id } });
    //     return {
    //       status: true,
    //       data: updatedProduct,
    //       message: "Update successfully",
    //     };
    //   } else {
    //     return {
    //       status: false,
    //       data: null,
    //       message: "Product not found or update failed",
    //     };
    //   }
    // } catch (err) {
    //   return {
    //     status: false,
    //     data: null,
    //     message: "update failed"
    //   }
    // }
  }

  async remove(id: number) {
    try {
      let productId = await this.productRepository.delete(id)
      return {
        message: "delete success",
        data: productId
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }
}
