const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors');

// use middleware
app.use(cors())
app.use(express.json())

// user name: todoList
// password: awXTuHFupE4xDMXm


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jerzt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    await client.connect();
    const taskCollection = client.db("todoList").collection("task");

    app.get('/userTask', async (req, res) => {
        const query = {}
        const tasks = await taskCollection.find(query).toArray()
        res.send(tasks)
    })

    app.post('/userTask', async (req, res) => {
        const newTask = req.body
        const result = await taskCollection.insertOne(newTask)
        res.send(result)
    })

    app.delete('/userTask/:id', async (req, res) => {
        const id = req.params.id
        const query = {_id: ObjectId(id)}
        const result = await taskCollection.deleteOne(query)
        res.send(result)
    })

  }
  finally{
    // await client.close()
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome to To Do List')
})

app.listen(port, () => {
    console.log('Server is running');
})