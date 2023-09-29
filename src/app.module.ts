import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductModule } from './modules/product/product.module';

import { UsersModule } from './modules/users/users.module';
import { AuthenModule } from './modules/authen/authen.module';
import { UploadModule } from './modules/upload/upload.module';

import { UserAddressesModule } from './modules/user-addresses/user-addresses.module';
import { ProductOptionModule } from './modules/product-option/product-option.module';
import { SocketModule } from './modules/socket/socket.module';
import { ReceiptModule } from './modules/receipt/receipt.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    CategoriesModule,
    ProductModule,
    UsersModule,
    AuthenModule,
    UploadModule,
    UserAddressesModule,
    ProductOptionModule,
    SocketModule,
    ReceiptModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
