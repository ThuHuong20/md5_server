import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from 'src/firebase';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('/many')
  @UseInterceptors(FilesInterceptor('imgs'))
  async create2(@Body() body: any, @UploadedFiles() imgs: Array<Express.Multer.File>) {
    console.log("imgs", imgs)
    return
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    console.log("file", file)
    console.log("body", JSON.parse(body.user).email);
    let url = await uploadFileToStorage(file, "test", file.buffer)
    console.log("url", url)
    return "Ok"
  }
}
