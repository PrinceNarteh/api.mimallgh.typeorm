import axios from 'axios';
import { faker } from '@faker-js/faker';

let mimall = {
  shopName: 'MiMall Gh',
  shopId: 'u587de3a7rnbdqghniwp9rzv',
};

let genieCouture = {
  shopName: 'Genie Couture',
  shopId: 'pizhvxj3k0001ao2qx72yghj',
};

let prinartITSolution = {
  shopName: 'Prinart IT Solution',
  shopId: 'comemwzhdn9597we6smnmb04',
};

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImR4ejlsZGh3aGVwMWlpajhlaXlxNzFqdyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg0MTQyNDMzLCJleHAiOjE2ODQxNDMzMzN9.BJ2w8s-t9MQw0lgBjgSBmSCOOJRUXRkWriyr6Hfw1sk';

const createOrder = async () => ({
  amount: faker.commerce.price(100, 9999),
  items: [
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.datatype.uuid(),
      shopId: mimall.shopId,
      shopName: mimall.shopName,
    },
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.datatype.uuid(),
      shopId: mimall.shopId,
      shopName: mimall.shopName,
    },
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.datatype.uuid(),
      shopId: genieCouture.shopId,
      shopName: genieCouture.shopName,
    },
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.datatype.uuid(),
      shopId: prinartITSolution.shopId,
      shopName: prinartITSolution.shopName,
    },
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.datatype.uuid(),
      shopId: prinartITSolution.shopId,
      shopName: prinartITSolution.shopName,
    },
  ],
});

async function createProducts() {
  console.log('Started Creating Orders');

  for (let i = 1; i <= 5; i++) {
    const order = await createOrder();

    console.log(order);
    try {
      const res = await axios.post('http://localhost:4000/orders', order, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  console.log('Done Creating Orders');
}

createProducts();
