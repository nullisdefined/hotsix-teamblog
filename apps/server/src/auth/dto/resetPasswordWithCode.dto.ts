export class ResetPasswordWithCodeDto {
  email: string;
  verificationCode: string;
  newPassword: string;
}
