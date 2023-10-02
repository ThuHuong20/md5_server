import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './entities/receipt.entity';

@Injectable()
export class ReceiptService {

  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
  ) { }

  create(createReceiptDto: CreateReceiptDto) {
    return 'This action adds a new receipt';
  }

  async findAll() {
    try {
      let receipts = await this.receiptRepository.find({
        relations: {
          user: {
            receipts: {
              detail: {
                option: {
                  product: {
                    productOption: true
                  }
                }
              }
            }
          }
        }
      })
      return {
        message: "find categories success",
        data: receipts
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} receipt`;
  }

  update(id: number, updateReceiptDto: UpdateReceiptDto) {
    return `This action updates a #${id} receipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} receipt`;
  }
}
