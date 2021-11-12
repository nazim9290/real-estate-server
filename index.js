const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://apartment:vdZxBYKY7yiins0k@cluster0.eanfw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("apartment_data");
    const propertyCollection = database.collection("properties");
    const usersCollection = database.collection("users");
    const bookingInfo = database.collection("booking_data");
    const agent = database.collection("agent");
    const review = database.collection("review");

    //get properties
    app.get("/properties", async (req, res) => {
      const cursor = propertyCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
      res.send(result);
    });
    //get agent
    app.get("/agent", async (req, res) => {
      const cursor = agent.find({});
      const result = await cursor.toArray();
      res.json(result);
      res.send(result);
    });
    //get reviews
    app.get("/reviews", async (req, res) => {
      const cursor = review.find({});
      const result = await cursor.toArray();
      res.json(result);
      res.send(result);
    });

    //get all booking
    app.get("/bookings", async (req, res) => {
      const cursor = bookingInfo.find({});
      const result = await cursor.toArray();
      res.json(result);
      res.send(result);
    });

    //post booking information
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      console.log("value", booking);
      const result = await bookingInfo.insertOne(booking);
      res.json(result);
    });

    //id parameter api
    app.get("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await propertyCollection.findOne(query);
      console.log(result);
      res.send(result);
      res.json(result);
    });

    //user booking email
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      console.log(email);
      const cursor = bookingInfo.find(query);
      const bookings = await cursor.toArray();
      res.json(bookings);
    });

    //id parameter delete
    app.delete("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await propertyCollection.deleteOne(query);
      console.log(result);
      res.send(result);
      res.json(result);
    });
    //update api with id
    app.put("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      console.log("hiited update api");
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateData.name,
          address: updateData.address,
          description: updateData.description,
          price: updateData.price,
          img: updateData.img,
          stay: updateData.stay,
        },
      };
      const result = await propertyCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.send(result);
      res.json(result);
    });

    //post api
    app.post("/properties", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await propertyCollection.insertOne(service);
      res.json(result);
    });
    //user order api
    app.post("/order", async (req, res) => {
      const order = req.body;
      console.log(order);
      console.log("order api hited");
      const result = await order_user.insertOne(order);
      res.json(result);
      res.send("order api hitted");
    });

    //check admin user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //user info post database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //user info update in database
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //make admin role
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello apartment portal!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
