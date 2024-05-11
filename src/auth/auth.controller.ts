import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieOptions, Response } from 'express';
import { SignInDto } from './dto/signIn.dto';
import { AllowAnon } from 'src/decorators/custom-decorators';

@Controller('auth')
export class AuthController {
  private readonly env = process.env.ENV;
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    ...(this.env !== 'DEV' && { sameSite: 'none' }),
    secure: this.env !== 'DEV',
    maxAge: 86400000,
  };
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

    response.cookie(
      `pft-session-${process.env.ENV.toLowerCase()}`,
      token,
      this.cookieOptions,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    response.status(200).send(rest);
  }

  @AllowAnon()
  @Post('logout')
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(
      `pft-session-${process.env.ENV.toLowerCase()}`,
      this.cookieOptions,
    );
  }

  @Get('profile')
  async getProfile(@Req() request) {
    const { sub } = request.jwtPayload;

    return await this.authService.getUserById(sub);
  }
}
