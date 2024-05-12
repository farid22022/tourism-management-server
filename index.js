const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

//middle ware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yn2a1td.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    await client.connect();
    const spotCollection = client.db('spotDB').collection('spot');
    const visitedCollection = client.db('spotDB').collection('visitedspot');
    const commentCollection = client.db('spotDB').collection('feed');



    app.get('/spot', async(req, res)=>{
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/spot', async(req, res)=> {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })

    app.get('/spot/:id' , async(req ,res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await spotCollection.findOne(query);
      res.send(result);
    })

    app.put('/spot/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedSpot = req.body;
      const Spot = {
        $set:{
            image: updatedSpot.image, 
            tourSpot: updatedSpot.tourSpot,country, 
            country : updatedSpot.country,
            location : updatedSpot.location,
            description: updatedSpot.description, 
            cost: updatedSpot.cost, 
            season: updatedSpot.season, 
            time: updatedSpot.time, 
            total: updatedSpot.total, 
            email: updatedSpot. email,
            name: updatedSpot.name,
        }
      }

      const result = await spotCollection.updateOne(filter,Spot, options);
      res.send(result);
    })

    app.delete('/spot/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    })


    //visited place
    app.get('/visitedspot', async(req, res)=>{
      const cursor = visitedCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/visitedspot', async(req, res)=> {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await visitedCollection.insertOne(newSpot);
      res.send(result);
    })

    //comment section
    app.get('/feed', async(req, res)=>{
      const cursor = commentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/feed', async(req, res)=> {
      const newFeed = req.body;
      console.log(newFeed);
      const result = await commentCollection.insertOne(newFeed);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send('Tourism Management server is running ')
})

app.listen(port , () =>{
    console.log(`Tourism Management Server is running on port :${port}`)
})