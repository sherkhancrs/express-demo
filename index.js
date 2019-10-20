const Joi = require('@hapi/joi');
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  {id: 1, name: "course1"},
  {id: 2, name: "course2"}
]
app.get('/', (req, res) => {
  res.send("Hello World!!!");
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
})

app.get('/api/courses/:id', (req, res)=> {
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) res.status(404).send("The course with given ID was not found");
  res.send(course);
})

app.post('/api/courses', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  const result = schema.validate(req.body);


  if (result.error) {
    //400 bad request
    res.status(400).send(result.error.details[0].message);
    return;
  }
  let course = {
    id: courses.length+1,
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
})