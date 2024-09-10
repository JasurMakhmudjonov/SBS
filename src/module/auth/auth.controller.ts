import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  async adminLogin(@Body() payload: LoginDto) {
    return this.authService.adminLogin(payload);
  }
}
