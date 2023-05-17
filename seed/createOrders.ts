import axios from 'axios';
import { faker } from '@faker-js/faker';

// local
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

// hosted
// const products = [
//   'a1vcll4g7y7xgl5o5n3w6mgn',
//   'a9u6iii4czo6nkxb7bjc1ovt',
//   'abazv0uva552behqpcvaztz9',
//   'aehldyitncimp303eanj8732',
//   'aetopilryg8kpwbovxshvmp2',
//   'aggg1m2rmk4fayid84rlb0lj',
//   'ai4zswjzy4v4jrfte20f7c56',
//   'aj5kamyavvykwzrr5z46950u',
//   'aluqgkhilwtgbi40ckm73bv8',
//   'aokoh4b0dqtgyt2iwqoo3vsi',
//   'aq3mlj48o8o1gj8jj5qbjt23',
//   'arhy9yjyveftl6uy8wu9czek',
//   'at6tlbqf1893q7f8rkmg0ocs',
//   'atibub173q4lozarmcqbb9l0',
//   'atlpafef6t2ci1gok8cqf2ez',
//   'aufxme2jm6k0kag5hu106boi',
//   'avqnll4k9u3snhk5insuaio0',
//   'ax85u2id23qvoyvjju7r0o02',
//   'ayxpu1xzjdy9572bwzpwsim1',
//   'b369ifesff9w8x84gwjdv1lh',
//   'b5qwdu76vj1c7s1dycc852mg',
//   'b5r88jpedxwd4kt8eh07s5i5',
//   'b6d9bzji30xbhye61291phvg',
//   'b76s4kz874cuh2mune87gc9w',
//   'b7i4no8s2g5l7e2te6awyyag',
//   'b7j95x9lso6ov8qlegk8q7do',
//   'b90nz89m19hwfxv4lmskmcg5',
//   'bayvqgim0arm9zliihihnhlh',
//   'bde4hded4k86bsdc7sipcuc3',
//   'be36weugoknctuzyufvw0m7h',
//   'bi0llwsrjz0riincjyviei4u',
//   'bjgbazntbwdm9f5gajzgp25m',
//   'bk20p5m3yz2nzwd8iatjk0xm',
//   'bmn8ijen63zucprqgfpwr2ow',
//   'bnym6ubvckl0b0n59q7e7vgw',
//   'bofcn9pgsegn7tiutsbu1i2k',
//   'bothn6eb62cx7yqebsib59u6',
//   'bqflq2eydh64y0u7eodrkiyr',
//   'bt364ee59fomd8oo144vd5ri',
//   'bte2t2hac9zbdlywywdujkla',
//   'by3sks01ndahnnh60pxj16h6',
//   'bz1803nzb2b0cr2364asqsso',
//   'bzl3vlajm9gi60yvb10v0mwc',
//   'c1yytte3gphf365u0v0ept0v',
//   'c2cczn4ek67645kcp5qbtrzj',
//   'c3gdx9lss32xk9jeb41surqt',
//   'c48862xjvpbn3h6y3gzjzbm7',
//   'c8i8nmc8m6fgbunt20lu2oq8',
//   'c9iz5ggt9oz24wtf2tdb126k',
// ];

// local shop
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

// hosted shops
// let mimall = {
//   shopName: 'MiMall Gh',
//   shopId: 'bnp6ihc6ebolq13tes26vkvl',
// };

// let genieCouture = {
//   shopName: 'Genie Couture',
//   shopId: 'nz59r8mwwyo0j0eqbl2g0shw',
// };

// let prinartITSolution = {
//   shopName: 'Prinart IT Solution',
//   shopId: 'qfzeov85t8wsmlx9beavkdo2',
// };

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImR4ejlsZGh3aGVwMWlpajhlaXlxNzFqdyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg0MjEzNzY2LCJleHAiOjE2ODQyMTQ2NjZ9.Qg9ganVVTLiN0NATHj2JqJhcOVHtFcuzuiz29ed7jn8';

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

    try {
      const res = await axios.post('http://localhost:4000/orders', order, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        console.log(res.data);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  console.log('Done Creating Orders');
}

createProducts();
