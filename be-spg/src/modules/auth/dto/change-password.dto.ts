import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';

function Match(
  relatedProperty: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName: propertyName.toString(),
      constraints: [relatedProperty],
      options: validationOptions,
      validator: {
        validate(value: unknown, arguments_: ValidationArguments): boolean {
          const [property] = arguments_.constraints as [string];
          const relatedValue = (arguments_.object as Record<string, unknown>)[
            property
          ];

          return value === relatedValue;
        },
      },
    });
  };
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  @Match('newPassword', {
    message: 'Mật khẩu xác nhận không khớp.',
  })
  confirmPassword!: string;
}
