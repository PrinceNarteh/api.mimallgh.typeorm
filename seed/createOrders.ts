import axios from 'axios';
import { faker } from '@faker-js/faker';

const products = [
  'a040codgv8i1js6r0lovh6bu',
  'a3ctwthpij57fxja06mrldya',
  'a3ghxgwwc4now4skflofihj7',
  'ac7n5y1h1ew9jixz8lqaejl9',
  'agckrk76lxcibpcrxjgnliru',
  'agz8r1x1y1chj0fudah70jb6',
  'ahdbbaoqtounate8r238tdw7',
  'ahn7kc2havwjm6ojx621ih7q',

  'aig96cehcq1m8j2ip1szkw7s',

  'ao1ko6g739lfxexsfoy7jazm',

  'arpwatza0lktuchryoekbtrs',

  'at0b4vus0iyix1zn4ry028kz',

  'awrfagvqsa4bzvwla20tbigw',

  'ay31nuren5wp6njxtgyka11t',

  'aym13zvwb5klnl8a41fschtj',

  'ayw4mezyxyt0nitzvwixhzu8',

  'ayz0l6i2hcty6zj5rhrjrlfm',

  'azrv0o2xvnr8hlhxoqrasglg',

  'azu1w67pgchs87916anqlz2f',

  'b570osvob7kunnwnbmzg1ylq',

  'b7dbogv2qzlkr6h40wn30lmt',

  'bai2svkm1k4iudgyf1bya5pn',

  'bb9ccejba8kp9zus8up303du',

  'bber89nje7y45s0r7htoj7o7',

  'bghuh5am3vk00fzz3a44cpyv',

  'bh3bvjmlrd1oo1oco9j0qeqg',

  'bmzzwh00afzyrm1qmml1o09k',

  'bnzrc3snxe8sckj6pbtovmey',

  'boyem0fkbx9m8o5suaj7f1k7',

  'bqlntzscx7mdbkvnhbr5mz5r',

  'br90kr2n41nz24b0zf1w5bwj',

  'brtjk2crffaqiqxuxcmew8rz',

  'btyq7ol8vba7vfkq4sko5j0p',

  'bwq9bobnkj9we232gv14ng1l',

  'bx3xf3ritkzzi8kgwbsav9hj',

  'bzktm6x6vc5t71wja5iqefb8',

  'c0bgi517wjjkcj03bf8e0ucx',

  'c0yi2fhq3mdnrg25w2mx7smd',

  'c22nexr7w3pgfrjubu68utc1',

  'c2harxsldmo59m93eke4ehjw',

  'c2wwjrytg2cyaoy7x82up7ma',

  'c5ce2uzjix8z95ad6q83xzao',

  'c5yhxsdld2lnnuq2n668qtph',

  'ca7vhgul7bsuhjr67u4b8fjn',

  'ccaezohzf2iskq59y32l1dix',

  'cfp7wuyodpa8jcduorq5x0kx',

  'ckz1z9al7cs63016gsz1sopc',

  'cpmuyipsz5aqdqevd0nb5ryq',

  'cpy01mrfq463l3ufrkad11ea',

  'cq5os0lvbgudobsy9gzexqcq',
];

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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImR4ejlsZGh3aGVwMWlpajhlaXlxNzFqdyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg0MTY0MDU5LCJleHAiOjE2ODQxNjQ5NTl9.pPPe3i8f46_JqH244gQ6vVjg2g3T1LVMConDKpDoNmg';

const createOrder = async () => ({
  amount: parseFloat(faker.commerce.price(100, 9999)),
  items: [
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.helpers.arrayElement(products),
      shopId: mimall.shopId,
      shopName: mimall.shopName,
    },
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.helpers.arrayElement(products),
      shopId: mimall.shopId,
      shopName: mimall.shopName,
    },
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.helpers.arrayElement(products),
      shopId: genieCouture.shopId,
      shopName: genieCouture.shopName,
    },
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.helpers.arrayElement(products),
      shopId: prinartITSolution.shopId,
      shopName: prinartITSolution.shopName,
    },
    {
      productName: faker.commerce.productName(),
      quantity: faker.datatype.number({ max: 20 }),
      price: parseFloat(faker.commerce.price(1, 50)),
      productId: faker.helpers.arrayElement(products),
      shopId: prinartITSolution.shopId,
      shopName: prinartITSolution.shopName,
    },
  ],
});

async function createProducts() {
  console.log('Started Creating Orders');

  for (let i = 1; i <= 5; i++) {
    const order = await createOrder();

    const res = await axios.post('http://localhost:4000/orders', order, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      console.log(res.data);
    } else {
      console.log(res.data.message);
    }
  }

  console.log('Done Creating Orders');
}

createProducts();
