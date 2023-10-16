const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tydoizp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const coffeeCollections = client.db("coffeeDB").collection('coffee');
    const usersCollections = client.db("coffeeDB").collection('users');


    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollections.findOne(query);
      res.send(result);
    })

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollections.insertOne(newCoffee);
      res.send(result);

    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const updateCoffee = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = {
        $set: {
          name: updateCoffee.name,
          chef: updateCoffee.chef,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo,
          price: updateCoffee.price
        }
      }
      const result = await coffeeCollections.updateOne(query, coffee, options);
      res.send(result);
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollections.deleteOne(query);
      res.send(result);
    })

    app.get('/users', async (req, res) => {
      const cursor = usersCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await usersCollections.insertOne(users);
      res.send(result);

    })

    app.patch('/users', async (req, res) => {
      const user = req.body
      const filter = {
        email: user.email
      };
      const updated = {
        $set: {
          lastSignInTime: user.lastSignInTime
        }
      }
      const result = await usersCollections.updateOne(filter, updated);
      res.send(result);
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersCollections.deleteOne(query);
      res.send(result);
    })


    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Coffee making server is running')
})

app.listen(port, () => {
  console.log(`Coffee server is running on PORT: ${port}`)
})