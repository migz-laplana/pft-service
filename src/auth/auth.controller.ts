import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInDto } from './dto/signIn.dto';
import { AllowAnon } from 'src/decorators/custom-decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AllowAnon()
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    const isDevEnv = process.env.ENV === 'DEV';
    response.cookie(`pft-session-${process.env.ENV.toLowerCase()}`, token, {
      httpOnly: true,
      ...(!isDevEnv && { sameSite: 'none' }),
      secure: !isDevEnv,
      maxAge: 86400000,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    response.status(200).send(rest);
  }

  @AllowAnon()
  @Post('logout')
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(`pft-session-${process.env.ENV.toLowerCase()}`);
  }

  @Get('profile')
  async getProfile(@Req() request) {
    return request.jwtPayload.profile;
  }
}
