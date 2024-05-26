const { knex } = require('./connection')

const createCustomer = async (customer) => {
    const id = await knex('customers').insert(customer);
    return id
}

const getCustomerByUserName = async (user_name) => {
    const user = await knex('customers').select('*').where({ user_name }).first()
    return user
}

const getCustomerById = async (id) => {
    const user = await knex('customers').select('*').where({ id }).first()
    return user
}

module.exports = {
    createCustomer,
    getCustomerByUserName,
    getCustomerById
}
