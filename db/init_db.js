const {client} = require('./client')
// code to build and initialize DB goes here
const {
  createUser,
  createProduct,
  addProductToOrder,
  createReview
  } = require('./index');
const { createOrder } = require('./orders');

async function buildTables() {
  try {
    client.connect();
    console.log('tables are being dropped')
    // drop tables in correct order
    await client.query(`
    DROP TABLE IF EXISTS order_products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    `);
    console.log('tables are being built')
    // build tables in correct order
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY key,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" TEXT NOT NULL,
        email VARCHAR(320) UNIQUE NOT NULL,
        "imageURL" TEXT default 'images/user-images/muffins.jpg',
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "isAdmin" BOOLEAN DEFAULT false NOT NULL,
        address VARCHAR(255) NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip VARCHAR(5) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        status TEXT DEFAULT 'created',
        "userId" INTEGER REFERENCES users(id),
        "datePlaced" DATE
        );
      `);

    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        "imageURL" text default 'images/30215.jpg',
        "inStock" BOOLEAN DEFAULT false NOT NULL,
        category VARCHAR(255) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE reviews ( 
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL, 
        stars INTEGER NOT NULL, 
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id)
      );
    `);

    await client.query(`
      CREATE TABLE order_products (
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "orderId" INTEGER REFERENCES orders(id),
        price INTEGER NOT NULL,
        quantity INTEGER DEFAULT 0 NOT NULL,
        UNIQUE ("productId", "orderId")
      );
    `);
    console.log('the tables have been built')
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  console.log('creating users...');
  try {
    const usersToCreate = [
      { firstName: 'crystal', lastName: 'joyce', email: 'crystaljoyce@me.com', imageURL: 'https://www.instagram.com/p/BzbK_H5gvUH/?utm_source=ig_web_copy_link', username: 'crystal', password: 'password1', isAdmin: true, address: '1234 Main Street', city: 'Some City', state: 'AZ', zip: '12345' },
      { firstName: 'walter', lastName: 'white', email: 'ilovescience@me.com', imageURL: 'https://www.denofgeek.com/wp-content/uploads/2013/07/288895.jpg?resize=636%2C432', username: 'bagsomoney', password: 'password2', isAdmin: false, address: '555 Maple Drive', city: 'Honolulu', state: 'HI', zip: '99900'  },
      { firstName: 'fred', lastName: 'flinstone', email: 'dinoman@me.com', imageURL: 'https://cdn11.bigcommerce.com/s-5ylnei6or5/images/stencil/1280x1280/products/1928/4722/2889_FredFlinstone_40__68124.1553186314.jpg?c=2', username: 'rocksrule', password: 'password3', isAdmin: false, address: '9876 Broadway', city: 'New York City', state: 'NY', zip: '00678'  },
      { firstName: 'Amadeo', lastName: 'R.', email: 'starwebdeveloper@yahoo.com', imageURL: 'https://cdn11.bigcommerce.com/s-5ylnei6or5/images/stencil/1280x1280/products/1928/4722/2889_FredFlinstone_40__68124.1553186314.jpg?c=2', username: 'amadeo', password: 'password123', isAdmin: true, address: '9876 Broadway', city: 'New York City', state: 'NY', zip: '00678'  },
      { firstName: 'Dolfo', lastName: 'lastname goes here', email: 'dolfo@aol.com', imageURL: 'https://cdn11.bigcommerce.com/s-5ylnei6or5/images/stencil/1280x1280/products/1928/4722/2889_FredFlinstone_40__68124.1553186314.jpg?c=2', username: 'dolfo', password: 'password123', isAdmin: true, address: '9876 Broadway', city: 'New York City', state: 'NY', zip: '00678'  },
      { firstName: 'Samantha', lastName: 'Runyan', email: 'person@gmail.com', imageURL: 'https://www.instagram.com/p/BzbK_H5gvUH/?utm_source=ig_web_copy_link', username: 'username23', password: 'password123', isAdmin: true, address: '123 Fake Street', city: 'Some City', state: 'IN', zip: '60638' }
    ]
    const users = await Promise.all(usersToCreate.map(createUser));
    console.log('users created: ');
    console.log(users);
    console.log('finshed creating users');


    console.log('creating products')
    const productsToCreate = [
      { name: 'Wardrobe Edit', description: 'Are you having a difficult time getting dressed in the morning? Sometimes you have all the right pieces in our closets but the clutter overwhelms us and we cannot find what we need to get dressed quickly, easily and looking good.', price: '250', imageURL: 'https://specials-images.forbesimg.com/imageserve/37781502/960x0.jpg?cropX1=408&cropX2=3608&cropY1=729&cropY2=2529', inStock: true, category: 'Breakfast' },
      { name: 'New Currated Wardrobe', description: 'Ready to start over? Sometimes a fresh start is exactly what a closet needs.', price: '150', imageURL: 'https://wwd.com/wp-content/uploads/2016/12/fashion-samples.jpg?w=640&h=415&crop=1', inStock: true, category: 'Dessert' },
      { name: 'Monthly Subscription', description: 'With this option I\'ll send you a box monthly with two currated outfits that will also blend nicely with your current wardrobe.', price: '75', imageURL: 'https://www.leahingram.com/wp-content/uploads/2017/10/trunk-club-image.jpg', inStock: true, category: 'Dinner' },
      { name: 'Special Event', description: 'Welcome to island time! In this Food With Friends kit we\'re transporting you to a tropical island paradise, complete with you new friend, Morgan (that\s Captain if ya\' nasty.) This kit comes with everything you need to make jerk chicken and island sides for 4, including 4 tropical hurricanes with Captain Morgan.', price: '80', imageURL: 'https://i0.wp.com/www.thismomsmenu.com/wp-content/uploads/2019/02/Low-Carb-Hurricane.png?w=680&ssl=1', inStock: true, category: 'Dinner' },
      { name: 'Transitioning to a New Look', description: 'Aloha! In Hawaii that means hello and goodbye, which is what you\'ll be saying to a good time and your troubles, when you open this kit from Food With Friends. In this Food With Friends, you\'ll find everything you need for pulled pork sliders for 6 with paired with fresh golden pineapple directly from Hawaii, in addition to everything you need for Mai Tais with Mahina.', price: '90', imageURL: 'https://s.wsj.net/public/resources/images/BN-SL763_0318Ho_M_20170313184908.jpg', inStock: true, category: 'Lunch' },
      { name: 'Vacation or Destination Styling', description: 'Your dear friend, Mary. She\'s always there the day after day after a wild night and always up for brunch on a Sunday. This spicy Food With Friends kit includes everything you need for a cozy brunch for 4, including the garnish for your Bloody Mary to accompany your delicious brunch of quiche, donuts and madame croque. ', price: '75', imageURL: 'https://www.culinaryhill.com/wp-content/uploads/2015/03/Bacon-and-Eggs-Bloody-Mary-8.jpg', inStock: true, category: 'Brunch' }

    ]
    const products = await Promise.all(productsToCreate.map(createProduct));
    console.log('products created: ');
    console.log(products);
    console.log('finsihed creating products');

    console.log('creating orders')
    const ordersToCreate = [
      { status: 'created', userId: 1},
      { status: 'created', userId: 2},
      { status: 'created', userId: 3, datePlaced: '2021-03-26' },
      { status: 'cancelled', userId: 5, datePlaced: '2021-03-23' },
      { status: 'cancelled', userId: 6, datePlaced: '2021-03-23' },
      { status: 'cancelled', userId: 4, datePlaced: '2021-03-23' },
      { status: 'completed', userId: 5, datePlaced: '2021-03-23' },
      { status: 'completed', userId: 6, datePlaced: '2021-03-23' }
    ]
    const orders = await Promise.all(ordersToCreate.map(createOrder));
    console.log('orders created: ')
    console.log(orders);
    console.log('finished creating orders')

    console.log('creating order_products');
    const orderProductsToCreate = [
      {productId: 1, orderId: 1, price: 150, quantity: 2},
      {productId: 2, orderId: 2, price: 200, quantity: 4},
      {productId: 3, orderId: 3, price: 200, quantity: 3},
      {productId: 4, orderId: 4, price: 200, quantity: 1},
      {productId: 5, orderId: 5, price: 200, quantity: 5},
      {productId: 6, orderId: 6, price: 200, quantity: 3},
      {productId: 2, orderId: 7, price: 200, quantity: 2},
      {productId: 3, orderId: 8, price: 120, quantity: 2}
    ]
    const orderProducts = await Promise.all(orderProductsToCreate.map(addProductToOrder))
    console.log('order_products created: ')
    console.log(orderProducts)
    console.log('finished creating order_products');

    console.log('creating reviews');
    const reviews = [
      { title: 'Everyone loved the crepes!', content: 'The crepes kit was a huge hit with my family. The mimosas were a perfect compliment to the crepes at our brunch. I cannot wait to try another kit soon!', stars: 5, userId: 3, productId: 1 },
      { title: 'Oh so tasty', content: 'My wife bought me this churros kit, I think I overbaked the churros. They were only okay. But the margs were some of the best I have ever had.', stars: 4, userId: 1, productId: 2 },
      { title: 'Yummy yummy in my tummy', content: 'Take all of my money. I want to buy every kit. All the kits.', stars: 4, userId: 4, productId: 3 },
      { title: 'This was delish in my dish!', content: 'The receipes were so easy and so tasty. yummmmm yummmmmmm', stars: 4, userId: 1, productId: 4 },
      { title: 'Those ritas tho.', content: 'Everytime we go to Disneyland I buy a big Churro. These weren\'t quite to D-land standard, but damn close.', stars: 4, userId: 1, productId: 2 },
      { title: 'Mai Tais were amazing!', content: 'We went to Maui for our honeymoon, 35 years ago and this box transported me right back. Thank you, Food With Friends!', stars: 5, userId: 5, productId: 5 },
      { title: 'Jerk Chicken was SO nice', content: 'That was the first time I\'ve ever had jerk chicken and man was it good! I cannot wait to cook that again.', stars: 4, userId: 6, productId: 4 },
      { title: 'There really is something about Mary', content: 'I love a good bloody mary but I don\'t love keeping all the ingredients on hand. This was perfect!', stars: 4, userId: 2, productId: 6 },
      { title: 'The lamb was so tender', content: 'I was not sure what to expect with lamb and mint, but it was absolutely delicious. The Jameson was like drinking gasoline. That stuff was hard to sip.', stars: 4, userId: 2, productId: 3 }

    ]
    const review = await Promise.all(reviews.map(createReview))
    console.log('order_products created: ')
    console.log(review)
    console.log('finished creating order_products');

  } catch (error) {
    console.log('error creating intital data');
    throw error;
  }
}

const buildDB = async () => {
  await buildTables()
    .then(populateInitialData)
    .catch(console.error);
}

module.exports = {buildDB};
