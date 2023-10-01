import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Res, UseInterceptors, UploadedFile, Req, UploadedFiles, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from 'src/firebase';
import { PaginationDto } from './dto/pagination.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response, @Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {

    const data = JSON.parse(body.products)
    // const data = req.body;
    let avatar = await uploadFileToStorage(file, "products", file.buffer)
    const newData = {
      ...data,
      avatar: avatar
    }
    try {
      let serviceRes = await this.productService.create(newData)
      //res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      console.log("ProductController ~ create ~ err:", err)
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }


  @Get()
  async findAll(@Res() res: Response, @Query("skip", ParseIntPipe) skip: number, @Query("take", ParseIntPipe) take: number) {
    try {
      let pagination: PaginationDto = {
        skip,
        take
      }
      let serviceRes = await this.productService.findAll(pagination)
      res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      let serviceRes = await this.productService.findOne(id)
      // res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res: Response) {
    // try {
    //   let serviceRes = await this.productService.update(id, updateProductDto)
    //   res.statusMessage = serviceRes.message;
    //   return res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes.data)
    // } catch (err) {
    //   throw new HttpException('loi xu li', HttpStatus.BAD_REQUEST)
    // }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      let serviceRes = await this.productService.remove(id)
      // res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }
}
