import { JwtFactory } from '@/app/factories/jwt.factory';
import Jwt from '@/app/infrastructure/auth/jwt';
import { container } from '@/container';

export default function () {
  container.register(Jwt.name, () => JwtFactory.factory());
}
