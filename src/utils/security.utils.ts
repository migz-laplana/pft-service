import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltOrRounds = 12;
  return await bcrypt.hash(password, saltOrRounds);
};

export const verifyPasswordHash = async (
  inputPassword: string,
  basePassword: string,
) => {
  const isValidUser = await bcrypt.compare(inputPassword, basePassword);

  return isValidUser;
};
