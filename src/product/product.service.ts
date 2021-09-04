import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {}

  getProducts(owner?: UserEntity): Promise<ProductEntity[]> {
    if (owner) {
      return this.productRepo.find({
        where: {
          owner: owner,
        },
      });
    }
    return this.productRepo.find();
  }

  async getProduct(
    productId: string,
    owner?: UserEntity,
  ): Promise<ProductEntity> {
    const product = await this.productRepo.findOne(productId, {
      loadRelationIds: true,
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    if (owner && product.owner !== owner.id) {
      throw new ForbiddenException('Product does not belong to you');
    }

    return product;
  }

  createProduct(newProduct: CreateProductDto): Promise<ProductEntity> {
    const product = this.productRepo.create(newProduct);
    return this.productRepo.save(product);
  }

  updateProduct(
    product: ProductEntity,
    update: UpdateProductDto,
  ): Promise<ProductEntity> {
    Object.assign(product, update);

    return this.productRepo.save(product);
  }

  deleteProduct(product: ProductEntity): Promise<ProductEntity> {
    return this.productRepo.remove(product);
  }
}
