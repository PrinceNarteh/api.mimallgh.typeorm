import axios from 'axios';
import { faker } from '@faker-js/faker';

const categories = [
  'food',
  'fashion_and_wears',
  'grocery_and_general',
  'health_and_wellness',
  'home_and_electrical_appliances',
  'personal_services',
  'printing_and_stationery',
  'tech',
];

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InFmemVvdjg1dDh3c21seDliZWF2a2RvMiIsIm5hbWUiOiJQcmluYXJ0IElUIFNvbHV0aW9uIiwic2hvcENvZGUiOiJDUkNDMjMwMDAwMDMiLCJpYXQiOjE2ODM3Nzc1ODksImV4cCI6MTY4Mzc3ODQ4OX0.UHk_XlPkbpHFU0hfVX9atYBtCH4kBe2NBiOCLf2YqYQ';

const createProduct = async (category: string) => ({
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price(1, 200)),
  discountPercentage: faker.datatype.number({ max: 50 }),
  stock: faker.datatype.number({ max: 200 }),
  brand: faker.commerce.productAdjective(),
  category,
  images: [
    {
      public_id: faker.datatype.uuid(),
      secure_url: faker.image.image(),
    },
    {
      public_id: faker.datatype.uuid(),
      secure_url: faker.image.image(),
    },
    {
      public_id: faker.datatype.uuid(),
      secure_url: faker.image.image(),
    },
    {
      public_id: faker.datatype.uuid(),
      secure_url: faker.image.image(),
    },
  ],
});

async function createProducts() {
  console.log('Started Creating Products');

  for (let i = 1; i <= 10; i++) {
    for (let category of categories) {
      const product = await createProduct(category);

      console.log(product);

      await axios.post('http://localhost:4000/products', product, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }
  }

  console.log('Done Creating Products');
}

createProducts();
