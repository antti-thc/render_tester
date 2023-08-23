const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', function(request, response ) { 
    if (request.method === "POST") {  
        return `${JSON.stringify(request.body)}`
    }
})

//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
      },
    {
        id: 2,
        name: "Jaajo Linnonmaa",
        number: "040-789456"
      }
    ]
    
app.get('/',(req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons',(req,res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    let length = persons.length 
    let pvm = Date()
    let info = `Phonebook has info for ${length} people`+ "<br>" + pvm
    res.send(info)
    
})

const generateId = () => {
    const newId = Math.floor(Math.random() * 10000)
    checkId = persons.find(person => person.id === newId)
    if (!checkId){
        return newId
    }
}

app.post('/api/persons', (request, response) => {
    
    const body = request.body
    const findName = persons.find(person => person.name === body.name)
    const findNumber = persons.find(person => person.number === body.number)

    if (findName) {
        return response.status(400).json({
            error: `name must be unique`
        })
    }

    if (findNumber) {
        return response.status(400).json({
            error: `number must be unique`
        })
    }

    if ((body.name === "") || (body.name === null)) {
        
        return response.status(400).json({
            error: `Name is required`
        })
    }

    if ((body.number === "") || (body.number === null)) {
        
        return response.status(400).json({
            error: `Number is required`
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    console.log(` ID number:${person.id} is for ${person.name}`)
    persons = persons.concat(person)
    response.json(person)  
})

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person =>  person.id === id)

    if (person) {
        console.log(person)
        response.json(person)
        
    } else {
        response.send(`<p>ID ${id} No data.</p>`)
        response.status(404).end()
    }    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})