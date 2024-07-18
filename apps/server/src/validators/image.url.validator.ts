import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidImageUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidImageUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // URL 형식 검사
          const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
          if (!urlPattern.test(value)) return false;

          // 허용된 도메인 검사 (예: Google Cloud Storage)
          const allowedDomains = ['storage.googleapis.com'];
          const url = new URL(value);
          return allowedDomains.includes(url.hostname);
        },
        defaultMessage(args: ValidationArguments) {
          return '올바른 이미지 URL 형식이 아니거나 허용되지 않은 도메인입니다.';
        },
      },
    });
  };
}
