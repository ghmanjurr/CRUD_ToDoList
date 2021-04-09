const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121

//connect to database
let db,
    dbConnectionStr = 'mongodb+srv://demo:demo@cluster0.xcdy5.mongodb.net/todo?retryWrites=true&w=majority',
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => {
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
    db.collection('todos').find().toArray()
    .then(data => {
        res.render('index.ejs', {zebra: data})
    })
})

//route that will hear the POST
app.post('/createToDo', (req, res) => {
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo item has been added')
        res.redirect('/')
    })
    //console.log(req.body.todoItem)
    
})

//route to mark todo item completed
app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

//route to mark UNDO item completed
app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

//route to delete
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn})
    .then(result =>{
        console.log('todo item deleted')
        res.json('Deleted it')
    })
})


app.listen(PORT, () => {
    console.log('Server is running, you better catch it!')
})

