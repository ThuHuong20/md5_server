import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Res, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: Response) {
    try {
      let serviceRes = await this.categoriesService.create(createCategoryDto)
      res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Query('q') q: string) {
    try {
      if (q != undefined) {
        return res.status(HttpStatus.OK).json(await this.categoriesService.searchByName(q))
      }
      let serviceRes = await this.categoriesService.findAll()
      res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes.data)
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }

  }


  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {

      let serviceRes = await this.categoriesService.findOne(id)
      res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes.data)
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      let serviceRes = await this.categoriesService.remove(id)
      res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }
}
