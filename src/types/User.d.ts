export interface IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  passwordDigest: string;
  address: string | null;
  phoneNumber: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  checkIfUnencryptedPasswordIsValid: (unencryptedPassword: string) => boolean;
  generateAuthToken: (user: IUser) => string;
}
