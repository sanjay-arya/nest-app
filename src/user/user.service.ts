import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly productService: ProductService,
    private jwtService: JwtService,
  ) {}

  async login({ username, password }: LoginUserDto) {
    const user = await this.userRepo.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // compare passwords
    const areEqual = await user.checkPassword(password);

    if (!areEqual) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser({ username, password }: CreateUserDto): Promise<UserEntity> {
    const userExist = await this.userRepo.findOne({
      where: { username },
    });

    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    let user = this.userRepo.create({
      username,
      password,
    });

    user = await this.userRepo.save(user);

    return user;
  }

  getUser(userId: string): Promise<UserEntity> {
    return this.userRepo.findOne(userId);
  }

  getProducts(user: UserEntity): Promise<ProductEntity[]> {
    return this.productService.getProducts(user);
  }

  getProduct(productId: string, user: UserEntity): Promise<ProductEntity> {
    return this.productService.getProduct(productId, user);
  }
}
