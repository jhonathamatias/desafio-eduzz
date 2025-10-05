export default class ValidateLoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
