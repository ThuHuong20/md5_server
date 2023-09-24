import { Test, TestingModule } from '@nestjs/testing';
import { ProductOptionController } from './product-option.controller';
import { ProductOptionService } from './product-option.service';

describe('ProductOptionController', () => {
  let controller: ProductOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOptionController],
      providers: [ProductOptionService],
    }).compile();

    controller = module.get<ProductOptionController>(ProductOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
