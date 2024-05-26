const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'admin1234',
        database: 'flights',
    },
});


module.exports = {
    knex
}