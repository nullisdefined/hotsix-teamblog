import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as PasswordValidator from 'password-validator';

const schema = new PasswordValidator()
  .is()
  .min(8) // 최소 길이 8
  .is()
  .max(50) // 최대 길이 50
  .has()
  .lowercase() // 소문자 포함
  .has()
  .digits(2) // 숫자 2개 이상 포함
  .has()
  .not()
  .spaces() // 공백 포함 금지
  .is()
  .not();
// .oneOf(['Passw0rd', 'Password123']); // 특정 비밀번호 금지

@ValidatorConstraint({ async: false })
class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: any, args: ValidationArguments): boolean {
    return typeof password === 'string' && (schema.validate(password) as boolean);
  }

  defaultMessage() {
    return '비밀번호는 최소 8자 이상, 최대 50자 이하, 알파벳 소문자와 숫자 2개 이상을 포함해야 하며 공백이 없어야 합니다.';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}
