const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9gfl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();

        const dressCollection = client.db("fabricHouse").collection("dress");
        const itemCollection = client.db("fabricHouse").collection("item");

        app.get("/dress", async (req, res) => {
            const query = {};
            const cursor = dressCollection.find(query);
            const dresses = await cursor.toArray();
            res.send(dresses);
        });

        app.get("/dress/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const dress = await dressCollection.findOne(query);
            res.send(dress);
        });

        app.put("/dress/:id", async (req, res) => {
            const id = req.params.id;
            const updateStockValue = req.body;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    quantity: updateStockValue.updatedQuentity,
                },
            };
            const result = await dressCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete("/dress/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await dressCollection.deleteOne(query);
            res.send(result);
        });

        app.post("/dress", async (req, res) => {
            const newDress = req.body;
            console.log("adding new dress", newDress);
            const result = await dressCollection.insertOne(newDress);
            res.send(result);
        });

        // load items
        app.get("/item", async (req, res) => {
            const email = req.query.email;
            const query = { userMail: email };
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.post("/item", async (req, res) => {
            const item = req.body;
            const result = await itemCollection.insertOne(item);
            res.send(result);
        });
        app.delete("(/item/:id)", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("server is running");
});

app.listen(port, () => {
    console.log("server is runnig on port", port);
});
