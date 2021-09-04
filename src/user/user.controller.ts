import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductEntity } from 'src/product/product.entity';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthUser } from './user.decorator';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  me(@AuthUser() user: UserEntity): Promise<UserEntity> {
    console.log(user);
    return this.userService.getUser(user.id);
  }

  @Get('/product')
  @UseGuards(JwtAuthGuard)
  getProducts(@AuthUser() user: UserEntity): Promise<ProductEntity[]> {
    return this.userService.getProducts(user);
    // return user;
  }

  @Get('/product/:productId')
  @UseGuards(JwtAuthGuard)
  getProduct(
    @AuthUser() user: UserEntity,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductEntity> {
    return this.userService.getProduct(productId, user);
  }
}
