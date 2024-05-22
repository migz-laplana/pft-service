import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { KindeClient } from 'src/client/kinde/kindeClient.service';

@Controller('auth')
export class AuthController {
  constructor(private kindeClient: KindeClient) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() request) {
    const { sub, permissions } = request.user;

    const kindeProfile = await this.kindeClient.getUserById(sub);
    return {
      ...kindeProfile,
      permissions,
    };
  }
}
