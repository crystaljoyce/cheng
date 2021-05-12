require('dotenv').config();

const {
  client,
  createUser,
  getOrderById
} = require('../db/');

const { buildDB } = require('../db/init_db')

describe('Database', () => {
    beforeAll(async() => {
      await buildDB();
    })
    afterAll(async() => {
        await client.end();
      })
      describe('Orders', () => {
        let order, queryOrder, queryProducts;
        describe('getOrderById(id)', () => {
          beforeAll(async () => {
            order = await getOrderById(1);

            const {rows: orderRows} = await client.query(`
              SELECT *
              FROM orders
              WHERE id = 1;
            `);

            queryOrder = orderRows[0];
          })

          it('Should return an id, status, userId, datePlaced', () => {
            expect(order.id).toEqual(queryOrder.id);
            expect(order.status).toEqual(queryOrder.status);
            expect(order.userId).toEqual(queryOrder.userId);
            expect(order.datePlaced).toEqual(queryOrder.datePlaced);
          })

          it('Should contain relevant info from the order\'s products', () => {
            expect(Array.isArray(order.products)).toEqual(true);
          })
        })
      });

      describe('Users', () => {
        let userToCreateAndUpdate, queriedUser;
        let userCredentials = {username: 'crystal', password: 'password1'};
        describe('createUser({ username, password })', () => {
          beforeAll(async () => {
            userToCreateAndUpdate = await createUser(userCredentials);
            const {rows} = await client.query(`SELECT * FROM users WHERE username = $1`, [userCredentials.username]);
            queriedUser = rows[0];
          })
          it('Creates the user', async () => {
            expect(userToCreateAndUpdate.username).toBe(userCredentials.username);
            expect(queriedUser.username).toBe(userCredentials.username);
          });
          it('Does not store plaintext password in the database', async () => {
            expect(queriedUser.password).not.toBe(userCredentials.password);
          });
          it('Hashes the password (salted 10 times) before storing it to the database', async () => {
            const hashedVersion = bcrypt.compareSync(userCredentials.password, queriedUser.password);
            expect(hashedVersion).toBe(true);
          });
          it('Does NOT return the password', async () => {
            expect(userToCreateAndUpdate.password).toBeFalsy();
          })

          })
      })
    });
