import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ProductEntity } from 'src/product/product.entity';
import { ProductController } from '../product/product.controller';
import { ProductService } from '../product/product.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/user.entity';
import { JwtStrategy } from 'src/user/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserController, ProductController],
  providers: [
    UserService,
    ProductService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
