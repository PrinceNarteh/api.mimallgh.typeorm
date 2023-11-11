import { JwtService } from "@nestjs/jwt";

export const generateToken = (payload: {id:string, role:string}, jwtService:JwtService) => {
  return jwtService.sign(payload)
}