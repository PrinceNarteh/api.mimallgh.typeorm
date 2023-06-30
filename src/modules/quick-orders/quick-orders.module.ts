import { Module } from '@nestjs/common';
import { QuickOrdersController } from './quick-orders.controller';
import { QuickOrdersService } from './quick-orders.service';

@Module({
  controllers: [QuickOrdersController],
  providers: [QuickOrdersService]
})
export class QuickOrdersModule {}
