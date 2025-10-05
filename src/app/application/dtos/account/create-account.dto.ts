export default class CreateAccountDto {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}
}
