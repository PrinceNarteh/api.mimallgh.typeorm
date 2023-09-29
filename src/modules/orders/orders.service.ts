import { Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { chain } from 'lodash';
import { FilterQuery } from 'mongoose';
import { UserService } from 'src/modules/users/user.service';
import { ProductService } from '../products/product.service';
import { ShopService } from '../shops/shop.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/orderDto';
import { OrderRepository } from './orders.repository';
import { OrderDocument } from './schema/order.schema';
import { UserDocument } from '../users/schema/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productService: ProductService,
    private readonly shopService: ShopService,
    private readonly userService: UserService,
  ) {}

  async getAllOrders(
    params: FilterQuery<OrderDocument>,
  ): Promise<OrderDocument[]> {
    const {
      currentPage,
      perPage,
      findOptions: { order, skip },
    } = params;

    return this.orderRepo.find({});
  }

  async getOrdersByUser(
    userId: string,
    params: FilterQuery<OrderDocument>,
  ): Promise<OrderDocument[]> {
    const {
      currentPage,
      perPage,
      findOptions: { order, skip },
    } = params;

    return this.orderRepo.find({});
  }

  async getOrdersByShop(shopId: string, params: FilterQuery<OrderDocument>) {
    const {
      currentPage,
      perPage,
      findOptions: { order, skip },
    } = params;

    const [orders, total] = await this.orderRepo.find({
      where: {
        shop: {
          id: shopId,
        },
      },
      skip,
      take: perPage,
      order,
      relations: {
        order: {
          user: true,
        },
      },
      select: {
        order: {
          id: true,
          amount: true,
          orderId: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const res = chain(orders)
      .map((item) => {
        return {
          ...item,
          createdAt: format(new Date(item.createdAt), 'do LLL yyyy'),
          updatedAt: format(new Date(item.updatedAt), 'do LLL yyyy'),
        };
      })
      .groupBy('createdAt')
      .map((value, i) => ({
        date: i,
        user: `${value[0].order.user.firstName} ${value[0].order.user.lastName}`,
        orders: chain(value)
          .groupBy('order.orderId')
          .map((val, idx) => ({
            orderId: idx,
            orderItems: val,
          }))
          .value(),
      }))
      .value();

    return {
      currentPage,
      perPage,
      total,
      data: res,
    };
  }

  async getOrderByShop(
    shopId: string,
    orderId: string,
  ): Promise<OrderDocument[]> {
    return await this.orderRepo.find({
      where: {
        shop: {
          id: shopId,
        },
        order: {
          id: orderId,
        },
      },
      relations: {
        order: true,
        product: {
          images: true,
        },
        shop: true,
      },
      select: {
        order: {
          id: true,
          orderId: true,
          user: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            image: true,
          },
        },
        product: {
          title: true,
          images: true,
        },
      },
    });
  }

  async getOrderById(orderId: string): Promise<OrderDocument> {
    return await this.orderRepo.findOne({
      where: {
        id: orderId,
      },
      relations: [
        'user',
        'items',
        'items.shop',
        'items.product',
        'items.product.images',
      ],
      select: {
        user: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
        },
        items: {
          price: true,
          quantity: true,
          product: {
            title: true,
            images: true,
          },
          shop: {
            name: true,
          },
        },
      },
    });
  }

  async createOrder(user: UserDocument, createOrderDto: CreateOrderDto) {
    const userExists = await this.userService.findById(user.id);

    const { items, ...result } = createOrderDto;
    let orderItems = [];

    for (let item of items) {
      let product = await this.productService.product(item.productId);
      let shop = await this.shopService.shop(item.shopId);
      const res = this.orderRepo.create({
        ...item,
        product,
        shop,
      });
      orderItems.push(res);
    }

    const order = this.orderRepo.create({
      ...result,
      user: userExists,
      items: orderItems,
    });

    await this.orderRepo.create(order);

    return order;
  }

  async updateOrder(
    userId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ) {
    let user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    let order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    await this.orderRepo.delete(orderId);

    const { items, ...data } = updateOrderDto;
    const orderItems = [];

    for (let item of items) {
      const orderItem = this.orderRepo.create(item);
      await this.orderRepo.create(orderItem);
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
