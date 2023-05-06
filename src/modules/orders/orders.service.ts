import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { OrderItem } from 'src/entities/OrderItem.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/orderDto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly userService: UserService,
  ) {}

  async getAllOrders(params: FindManyOptions<Order>): Promise<Order[]> {
    const { skip, take, where, order } = params;
    return await this.orderRepo.find({
      skip,
      take,
      where,
      order,
      relations: {
        items: true,
      },
    });
  }

  async getOrdersByUser(
    userId: string,
    params: FindManyOptions<Order>,
  ): Promise<Order[]> {
    const { skip, take, order } = params;
    return await this.orderRepo.find({
      where: {
        userId: {
          id: userId,
        },
      },
      skip,
      take,
      order,
      relations: {
        items: true,
      },
    });
  }

  async getOrdersByShop(
    userId: string,
    params: FindManyOptions<Order>,
  ): Promise<OrderItem[]> {
    const { skip, take, order } = params;
    return await this.orderItemRepo.find({
      where: {
        shopId: userId,
      },
      skip,
      take,
      order,
    });
  }

  async getOrderByShop(userId: string, orderId: string): Promise<OrderItem[]> {
    console.log('Called');
    return await this.orderItemRepo.find({
      where: {
        shopId: userId,
        order: {
          id: orderId,
        },
      },
      relations: ['user'],
    });
  }

  async getOrderById(orderId: string) {
    return await this.orderRepo.findOne({
      where: {
        id: orderId,
      },
      relations: {
        items: true,
      },
    });
  }

  async createOrder(user: User, createOrderDto: CreateOrderDto) {
    let userExists = await this.userService.user(user.id);
    if (!userExists) {
      throw new NotFoundException('User Not Found');
    }

    const { items, ...result } = createOrderDto;
    let orderItems = [];

    for (let item of items) {
      const res = this.orderItemRepo.create(item);
      await this.orderItemRepo.save(res);
      orderItems.push(res);
    }

    const order = this.orderRepo.create({
      ...result,
      userId: userExists,
      items: orderItems,
    });

    await this.orderRepo.save(order);

    return order;
  }

  async updateOrder(
    userId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ) {
    let user = await this.userService.user(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    let order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    await this.orderItemRepo.delete({
      order: {
        id: orderId,
      },
    });

    const { items, ...data } = updateOrderDto;
    const orderItems = [];

    for (let item of items) {
      const orderItem = this.orderItemRepo.create(item);
      await this.orderItemRepo.save(orderItem);
      orderItems.push(orderItem);
    }

    const updatedOrderData = {
      ...data,
      items: orderItems,
    };

    const updatedOrder = Object.assign(order, updatedOrderData);
    await updatedOrder.save();

    return order;
  }

  async deleteOrder(orderId: string) {
    return await this.orderRepo.delete(orderId);
  }
}
