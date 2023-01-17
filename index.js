const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const mongoDB = 'mongodb://localhost:27017/dog_api'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    age: Number
})

const Dog = mongoose.model('Dog', dogSchema)

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


const port = 45678

/*const dogs = [
    {name: "Jimbo", breed: "Husky"},
    {name:"Sam", breed: "Lab"}
]*/


app.get("/", (req, res) => {
    Dog.find((err, dogs) => {
    res.json(dogs)
    })
})

app.get("/dogs/:id", (req, res) => {
    Dog.findById(req.params.id, (err, dog) =>{
        res.json(dog)
    })
})

app.post("/dogs", (req, res) => {
    const dog = new Dog ({
        name: req.body.name,
        breed:req.body.breed,
        age: req.body.age
    })
    
    dog.save((err) => {
        res.json(dog)
    })
})

app.put("/dogs/:id", (req, res) => {
    const update = req.body
    Dog.findByIdAndUpdate(req.params.id, req.body, (err) => {
    res.json({message: `updated dog ${req.params.id}`})
    })
})
app.delete("/dogs/:id", (req, res) => {
    Dog.findByIdAndDelete(req.params.id, (err) => {
    res.json({message: `deleting dog ${req.params.id}`})
    }) 
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})