const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wo7cy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('doctors_portal').collection('services');
        const bookingCollection = client.db('doctors_portal').collection('bookings');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        /**
         * API Naming Convention
         * app.get('/booking') //get all data or more then one data.
         * app.get('/booking/:id')// get a specific data.
         * app.post('/booking') //add a new data.
         * app.patch('/booking/:id') //update a data.
         * app.delete('/booking/:id') //delete a data.
         **/

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient };
            const exists = await bookingCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, booking: exists })
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({ success: true, result })
        })

    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello Doctors Portal...')
})

app.listen(port, () => {
    console.log(`Doctors portal running on port ${port}`)
})