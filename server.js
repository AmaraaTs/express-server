const express = require("express");
const fs = require("fs"); // file system
const cors = require("cors");

const port = 8000;
const app = express();
app.use(cors());
app.use(express.json()); //middleware
// const users = [{ id: 1, name: "Naraa", age: 20 }];

app.get("/users", (req, res) => {
  const data = fs.readFileSync("./users.json", { encoding: "utf-8" });
  const obData = JSON.parse(data);
  console.log("Data", data);
  res.status(200).json({ users: obData.employees });
});

//
app.post("/users", (req, res) => {
  console.log("Body", req.body);
  const data = fs.readFileSync("./users.json", { encoding: "utf-8" });
  const { employees } = JSON.parse(data);
  const newUser = {
    eid: `${employees.length + 1}`,
    ...req.body, //spread operator
  };
  employees.push(newUser);
  fs.writeFileSync("./users.json", JSON.stringify({ employees }));
  res.status(201).json({ user: newUser });
});

//
app.put("/users/:userId", (req, res) => {
  const data = fs.readFileSync("./users.json", { encoding: "utf-8" });
  const { users } = JSON.parse(data);
  const findIndex = users.findIndex((user) => user.id === req.params.userId);
  if (findIndex > -1) {
    users[findIndex].name = req.body.name;
    fs.writeFileSync("./users.json", JSON.stringify({ users }));
    res.status(200).json({ user: users[findIndex] });
  } else {
    res.status(400).json({ message: "Not found user id" });
  }
});

//
app.delete("/users/:id", (req, res) => {
  const data = fs.readFileSync("./users.json", { encoding: "utf-8" });
  const { employees } = JSON.parse(data);
  const findIndex = employees.findIndex((user) => user.eid === req.params.id);
  if (findIndex > -1) {
    const deletedUser = employees.splice(findIndex, 1);
    fs.writeFileSync("./users.json", JSON.stringify({ employees }));
    res.status(200).json({ user: deletedUser[0] });
  } else {
    res.status(400).json({ message: "Not found user id" });
  }
});

//
app.listen(port, () => {
  console.log(`Server is running at localhost:${port}`);
});
