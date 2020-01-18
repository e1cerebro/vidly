const { User } = require("../../models/user");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
    //let server = require("../../app");

describe('user.generateAuthToken', () => {

    // let server;

    // beforeEach(async() => { server = require("../../app"); });

    // afterEach(async() => { server.close(); });


    it('should return a valid JWT web token', () => {

        const userPayload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            name: 'Uchenna Christian',
            role: 'admin'
        };

        const user = new User(userPayload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, 'jwtprivatekey');

        expect(decoded).toMatchObject(userPayload)
    });
});