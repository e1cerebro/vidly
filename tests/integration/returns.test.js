const moment = require('moment')
const { Rental } = require('../../models/rental');
const { User } = require("../../models/user")
const mongoose = require('mongoose');
const request = require('supertest');
let server;


describe('/api/returns', () => {
    //let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    beforeEach(async() => {
        server = await require("../../app");
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save();

    });

    afterEach(async() => {

        await server.close();
        // await Rental.deleteMany({});
    });


    it('should return a rental', async() => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });


    it('should return 401 if client is not logged in', async() => {

        token = '';
        const res = await exec();

        expect(res.status).toBe(401)

    });


    it('should return 400 customer id is not provided', async() => {

        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400)

    });

    it('should return 400 movie id is not provided', async() => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400)
    });


    it('should return 404 if not rental found with the customer/movie combination', async() => {

        await Rental.deleteMany({});
        const res = await exec();

        expect(res.status).toBe(404)
    });


    it('should return 400 if the return date is already set', async() => {

        rental.dateReturned = new Date();

        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400)
    });

    it('should return 200 if rental was successfully processed.', async() => {

        const res = await exec();

        expect(res.status).toBe(200)
    });


    it('should set return date if input is valid.', async() => {

        const res = await exec();

        const rentalObj = await Rental.findById(rental._id);

        //find the time diff
        const diff = new Date() - rentalObj.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);

        // expect(rentalObj.dateReturned).toBeDefined();
    });

    it('should set the rentalFee if input id valid.', async() => {

        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalObj = await Rental.findById(rental._id);

        expect(rentalObj.rentalFee).toBe(14);
    });


});