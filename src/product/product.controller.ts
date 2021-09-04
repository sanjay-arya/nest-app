import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/auth/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(): Promise<ProductEntity[]> {
    return this.productService.getProducts();
  }

  @Get('/:productId')
  getProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductEntity> {
    return this.productService.getProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(
    @AuthUser() user: UserEntity,
    @Body() product: CreateProductDto,
  ) {
    product.owner = user;
    return this.productService.createProduct(product);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:productId')
  async updateProduct(
    @AuthUser() user: UserEntity,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updates: UpdateProductDto,
  ) {
    const product = await this.productService.getProduct(productId, user);
    return this.productService.updateProduct(product, updates);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:productId')
  async deleteProduct(
    @AuthUser() user: UserEntity,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const product = await this.productService.getProduct(productId, user);
    return this.productService.deleteProduct(product);
  }
}
