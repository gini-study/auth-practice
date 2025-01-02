import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const secretText = "superSeccret";

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

app.use(express.json());

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  // Create a token (payload + secretText)
  const acessToken = jwt.sign(user, secretText);
  res.json({ acessToken: acessToken });
});

app.get("/posts", (req, res) => {
  res.json(posts);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
