import { JwtService } from '@nestjs/jwt';

type Payload = {
  id: string;
  role: string;
};

export const generateToken = (payload: Payload, jwtService: JwtService) => {
  return jwtService.sign({ id: payload.id, role: payload.role });
};
