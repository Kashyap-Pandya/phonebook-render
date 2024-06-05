const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
morgan.token("body", (req) => {
	return JSON.stringify(req.body);
});

//middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms :body"));
// app.use(requestLogger);
let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];
app.use(express.static("dist"));
//morgan

//getting all persons
app.get("/api/persons", (request, response) => {
	response.json(persons);
});

//info
app.get("/info", (request, response) => {
	const length = persons.length;
	const date = new Date();
	const htmlResponse = `
        <p>Phonebook has info for ${length} people</p>
        <p> ${date} </p>
    `;

	response.send(htmlResponse);
});

//getting single id
app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((p) => p.id === id);
	if (!person) {
		return response.status(404).json({
			error: "No person exist with this id",
		});
	}
	response.json(person);
});

//delete single person
app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((p) => p.id === id);
	if (!person) {
		return response.status(404).json({
			error: "No person exist with this id",
		});
	}
	persons = persons.filter((p) => p.id !== id);
	response
		.status(200)
		.json({ success: `person with ${id} deleted successfully` });
});

//adding a person
let generateID = () => {
	let random = Math.floor(Math.random() * 1000000000) + 1;
	console.log(random);
	return random;
};

app.post("/api/persons", (request, response) => {
	const body = request.body;

	//check for name and number
	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "Must provide name and number",
		});
	}
	const person = {
		id: generateID(),
		name: body.name,
		number: body.number,
	};

	//filtering non unique name

	const filter = persons.filter(
		(p) => p.name.toLowerCase() === body.name.toLowerCase()
	);
	if (filter.length > 0) {
		return response.status(400).json({
			error: "Name must be unique",
		});
	}
	persons.push(person);
	response.json(person);
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
