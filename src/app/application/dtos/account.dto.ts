export type CreateAccountDto = {
  name: string;
  email: string;
  password: string;
};

export type GetAccountDto = {
  id: string;
  name: string;
  email: string;
};
