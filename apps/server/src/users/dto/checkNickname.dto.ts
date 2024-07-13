import { IsNotEmpty, IsString } from 'class-validator';

export class CheckNicknameDto {
  @IsNotEmpty({ message: '닉네임은 비워둘 수 없습니다.' })
  @IsString({ message: '올바른 타입이 아닙니다.' })
  nickname: string;
}
