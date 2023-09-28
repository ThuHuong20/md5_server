import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      let category = await this.categoryRepository.save(createCategoryDto)
      return {
        message: "success",
        data: category
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      let category = await this.categoryRepository.find({
        relations: {
          products: true
        }
      })
      return {
        message: "find categories success",
        data: category
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: number) {
    try {
      let categoryId = await this.categoryRepository.findOne({
        where: { id },
        relations: {
          products: {
            productOption: true
          }
        }
      })
      return {
        message: "find categoryId success",
        data: categoryId
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    try {
      let categoryId = await this.categoryRepository.delete(id)
      return {
        message: "delete success",
        data: categoryId
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }

  }
  async searchByName(searchString: string) {
    try {
      let category = await this.categoryRepository.find(
        {
          where: {
            title: ILike(`%${searchString}%`),
          },
        }
      )
      return {
        message: "find categories success",
        data: category
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }
}
