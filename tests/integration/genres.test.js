//Allows us to make HTTP assertions
const request = require('supertest')
const { Genre } = require("../../models/genre")
const { User } = require("../../models/user")
let server;


describe('/api/genres', () => {

    //Starts the server before each test
    beforeEach(async() => { server = await require("../../app"); });
    //closes the server after each test
    afterEach(async() => {
        await server.close();
        await Genre.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all genres', async() => {

            const result = await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((item) => {
                return item.name === 'genre1'
            })).toBeTruthy();
            expect(res.body.some((item) => {
                return item.name === 'genre2'
            })).toBeTruthy();

        });

        it('should return a specific genre when an ID is provided', async() => {

            const result = await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ]);

            const insertedIds = result.insertedIds["0"];

            const res = await request(server).get('/api/genres/' + insertedIds);
            expect(res.status).toBe(200);
            //console.log(res);
            expect(res.body.name).toBe("genre1");
        });
    });


    describe('GET /:id', () => {
        it('should return a specific genre when an ID is provided', async() => {

            const result = await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ]);

            const insertedIds = result.insertedIds["0"];

            const res = await request(server).get('/api/genres/' + insertedIds);
            expect(res.status).toBe(200);
            //console.log(res);
            expect(res.body.name).toBe("genre1");
        });

        it('should return a 404 if invalid is provided', async() => {

            const insertedIds = "11234";

            const res = await request(server).get('/api/genres/' + insertedIds);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should return a 401 if client is not logged in', async() => {
            const res = await request(server).post('/api/genres').send({ name: 'gener1' });
            expect(res.status).toBe(401);
        });

        it('should return invalid if genre is less than 5 characters', async() => {

            const token = new User({ name: 'David', role: 'admin' }).generateAuthToken();


            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'gene' });
            expect(res.status).toBe(401);
        });

        it('should return invalid if genre is more than 50 characters', async() => {

            const token = new User({ name: 'David', role: 'admin' }).generateAuthToken();
            const name = new Array(52).join("1bc")

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: name });
            expect(res.status).toBe(401);
        });

        it('should save genre if valid', async() => {

            const token = new User({ name: 'David', role: 'admin' }).generateAuthToken();

            name = 'Test Genre';

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: name });

            const savedGenre = await Genre.find({ name: name })


            expect(res.status).toBe(200);
            expect(savedGenre).not.toBeNull();
        });

        it('should return genre object if successfully saved', async() => {

            const token = new User({ name: 'David', role: 'admin' }).generateAuthToken();

            name = 'test Genre';

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: name });


            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    });

})