const express = require('express')
const router = express.Router();
const { Customer } = require('../models/customer');
const { validateCustomer } = require('../modules/validation/input');


router.get('/', async(req, res) => {
    try {
        const customers = await Customer.find().sort('name');
        res.send(customers);
    } catch (ex) {
        return res.status(404).send(ex.message)
    }
});

router.get('/:id', async(req, res) => {

    const id = req.params.id;
    try {
        const customers = await Customer.findById(id);
        res.send(customers);
    } catch (ex) {
        return res.status(404).send(ex.message)
    }

});

router.post('/', async(request, response) => {

    //validate name
    const { error } = validateCustomer(request.body);
    //Fails - Send 404 message
    if (error) return response.status(404).send(error.details[0].message)


    let isGold = request.body.isGold;
    let name = request.body.name;
    let phone = request.body.phone;

    const customer = new Customer({
        isGold: isGold,
        name: name,
        phone: phone
    });

    try {
        const result = await customer.save();
        response.send(result);
    } catch (ex) {
        return response.status(404).send(ex.message)
    }
});

router.put('/:id', async(request, response) => {

    let isGold = request.body.isGold;
    let name = request.body.name;
    let phone = request.body.phone;

    const new_customer = {
        isGold: isGold,
        name: name,
        phone: phone
    }


    try {
        const customer = await Customer.findById(request.params.id);

        customer.isGold = isGold;
        customer.name = name;
        customer.phone = phone;

        const result = await customer.save()

        response.send(result);
    } catch (ex) {
        return response.status(404).send(ex.message)
    }
});
router.delete('/:id', async(request, response) => {

    try {
        const result = await Customer.findByIdAndDelete(request.params.id);

        response.send(result);
    } catch (ex) {
        return response.status(404).send(ex.message)
    }
});




module.exports = router;