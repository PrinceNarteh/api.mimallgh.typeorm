import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { OrderItem } from 'src/entities/OrderItem.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/orderDto';
import {
  FindManyReturnType,
  IFindManyOptions,
  returnValue,
} from 'src/types/findManyOptions';
import { chain } from 'lodash';
import { format } from 'date-fns';
import { ProductService } from '../products/product.service';
import { ShopService } from '../shops/shop.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly productService: ProductService,
    private readonly shopService: ShopService,
    private readonly userService: UserService,
  ) {}

  async getAllOrders(params: IFindManyOptions<Order>) {
    const {
      currentPage,
      perPage,
      findOptions: { order, skip },
    } = params;

    const [orders, total] = await this.orderRepo.findAndCount({
      order,
      skip,
      take: perPage,
      relations: {
        items: true,
        user: true,
      },
      select: {
        user: {
          firstName: true,
          lastName: true,
        },
      },
    });

    let idx = 0;
    let res = chain(orders)
      .map((item) => {
        return {
          ...item,
          createdAt: format(new Date(item.createdAt), 'do LLL yyyy'),
          updatedAt: format(new Date(item.createdAt), 'do LLL yyyy'),
        };
      })
      .map((value, i) => ({
        id: value.id,
        items: value,
      }))
      .groupBy('items.createdAt')
      .map((value, i) => {
        return {
          date: i,
          items: chain(value)
            .groupBy('items.orderId')
            .map((val, orderId) => {
              return {
                id: val[idx].id,
                amount: val[idx].items.amount,
                createdAt: val[idx].items.createdAt,
                user: `${val[idx].items.user.firstName} ${val[idx].items.user.lastName}`,
                orderId,
                orders: [...val[idx].items.items],
              };
            })
            .value(),
        };
      })
      .value();

    return {
      total,
      perPage,
      page: currentPage,
      data: res,
    };
  }

  async getOrdersByUser(
    userId: string,
    params: IFindManyOptions<Order>,
  ): Promise<FindManyReturnType<Order>> {
    const {
      currentPage,
      perPage,
      findOptions: { order, skip },
    } = params;

    const [orders, total] = await this.orderRepo.findAndCount({
      where: {
        user: {
          id: userId,
        },
      },
      skip,
      take: perPage,
      order,
      relations: {
        items: true,
      },
    });

    return returnValue({
      currentPage,
      perPage,
      total,
      data: orders,
    });
  }

  async getOrdersByShop(shopId: string, params: IFindManyOptions<Order>) {
    const {
      currentPage,
      perPage,
      findOptions: { order, skip },
    } = params;

    const [orders, total] = await this.orderItemRepo.findAndCount({
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

  async getOrderByShop(shopId: string, orderId: string): Promise<OrderItem[]> {
    return await this.orderItemRepo.find({
      where: {
        shop: {
          id: shopId,
        },
        order: {
          id: orderId,
        },
      },
      relations: {
        order: {
          user: {
            image: true,
          },
        },
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
            image: {
              secure_url: true,
            },
          },
        },
        product: {
          title: true,
          images: true,
        },
      },
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
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

  async createOrder(user: User, createOrderDto: CreateOrderDto) {
    const userExists = await this.userService.user(user.id);

    const { items, ...result } = createOrderDto;
    let orderItems = [];

    for (let item of items) {
      let product = await this.productService.product(item.productId);
      let shop = await this.shopService.shop(item.shopId);
      const res = this.orderItemRepo.create({
        ...item,
        product,
        shop,
      });
      await this.orderItemRepo.save(res);
      orderItems.push(res);
    }

    const order = this.orderRepo.create({
      ...result,
      user: userExists,
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
