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
  if(!course) return res.status(404).send("The course with given ID was not found");
  res.send(course);
})

app.post('/api/courses', (req, res) => {
  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCourse(req.body);

  if ( error ) return res.status(400).send(error.details[0].message);
  // if (error) {
  //   res.status(400).send(error.details[0].message);
  //   return;
  // }

  let course = {
    id: courses.length+1,
    name: req.body.name
  }
  courses.push(course);
  res.send(course);

})

app.put('/api/courses/:id', (req, res) => {
  // Look up the course
  // if not existing return 404
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send("The course with given ID was not found");

  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  // Update the course
  // return the updated course
  course.name = req.body.name;
  res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  // Non existing, return 404
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send("The course with given ID was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  // Delete

  res.send(course);
  // Return same course
})

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  return schema.validate(course);
}

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
})