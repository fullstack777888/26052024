const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const { createCustomer, getCustomerByUserName, getCustomerById } = require('./db/customers')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const PORT = 3001;
const SECRET = 'This is my secret key'

app.set('view engine', 'ejs')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(cookieParser())
// middleware

const getAllFlightsFromMySQL = () => {
    // DUMMY
    const flights = [
        { airlineName: 'El Al', destination: 'Israel', arrivalTime: '10:00' },
        { airlineName: 'WizzAir', destination: 'NY', arrivalTime: '11:00' },
        { airlineName: 'Lufthansa', destination: 'Dubai', arrivalTime: '13:00' }
    ]
    return flights
}


const logger = (req, res, next) => {
    console.log('i am in logger')
    next()
    return
}

app.use(logger)

const auth = async (req, res, next) => {    
    console.log(req.cookies)
    const token = req.cookies?.user_token;
    if (!token) {
        return res.redirect('/login')
    }

    try {
        await jwt.verify(token, SECRET)
    } catch (error) {
        console.log(error)
        return res.redirect('/login')
    }
    const user = await jwt.decode(token)
    req.dog = 'dog'
    req.user = user;
    return next()

}


app.get('/', auth, (req, res) => {
    const flights = getAllFlightsFromMySQL();
    res.render('index.ejs', { flights })
})

app.get('/customer', auth, async(req, res) => {
    const id = req.user?.id
    const customer = await getCustomerById(id);
    res.render('customer.ejs', { customer })
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/register', async (req, res) => {
    try {
        const formData = req.body
        const password = req.body.password;
        const user_name = req.body.user_name;

        const hashedPassword = await bcrypt.hash(password, 10)
        const customer = { user_name, password: hashedPassword }
        const userId = await createCustomer(customer)

        if (userId.length == 0) { //also check if params is valid
            res.render('register.ejs', { message: `The user ${req.body.name} is already exist`, formData })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('something went wrong');
    }
})

// app.post('/login', loginController) is the right way to go
app.post('/login', async (req, res) => {
    try {
        const formData = req.body
        const password = req.body.password;
        const user_name = req.body.user_name;

        const user = await getCustomerByUserName(user_name)
        if (!user) {
            return res.render('register.ejs', { message: `There is no such user ${user_name}`, formData })
        }
        const isPasswordOk = await bcrypt.compare(password, user?.password)

        if (!isPasswordOk) { //also check if params is valid
            return res.render('register.ejs', { message: `The password is wrong`, formData })
        } else {
            const jwtToken = jwt.sign({ id: user.id, user_name: user.user_name }, SECRET, { expiresIn: '10m' })
            console.log(jwtToken)
            res.cookie('user_token', jwtToken, { httpOnly: true })
            return res.redirect('/')
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('something went wrong');
    }
})

app.get('/api/flights', (req, res) => {
    res.json(flights)
})

app.post('/', (req, res) => {
    console.log('hello from express post')
    res.send('hello from express post')
})

app.delete('/', (req, res) => {
    console.log('hello from express delete')
    res.send('hello from express delete')
})


app.listen(PORT, () => {
    `express server is running on port ${PORT}`
})


app.use((err, req, res, next) => {
    res.status(500).send('Something went wrong');
});