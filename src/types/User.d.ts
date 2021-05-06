export type User = IUser;

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  password_digest: string;
  address: string | null;
  phone_number: string | null;
  created_at: Date;
  updated_at: Date;
}
