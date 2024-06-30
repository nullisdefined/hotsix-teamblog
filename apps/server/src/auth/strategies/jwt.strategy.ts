import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { Payload } from "../dto/payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {
      super({
        secretOrKey: 'SECRET_KEY',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }
  
  async validate(payload: Payload): Promise<any> {
    const { email } = payload;
    const user = await this.usersService.findByFields({
      where: { email: email }
    });
    if(!user) {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }
    return user;
  }
}