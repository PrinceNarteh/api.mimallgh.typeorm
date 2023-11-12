import { JwtService } from '@nestjs/jwt';
import { AdminDocument } from 'src/modules/admins/schemas/admin.schema';
import { DeliveryCompanyDocument } from 'src/modules/delivery-companies/schema/delivery-company.schema';
import { ShopDocument } from 'src/modules/shops/schema/shop.schema';
import { UserDocument } from 'src/modules/users/schema/user.schema';

type GenerateToken =
  | AdminDocument
  | DeliveryCompanyDocument
  | ShopDocument
  | UserDocument;

export const generateToken = (
  payload: GenerateToken,
  jwtService: JwtService,
) => {
  return jwtService.sign({ id: payload._id, role: payload.role! });
};
