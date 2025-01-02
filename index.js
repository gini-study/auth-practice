import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const secretText = "superSeccret";

const posts = [
  {
    username: "chlwldms",
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

app.get("/posts", authMiddleware, (req, res) => {
  res.json(posts);
});

function authMiddleware(req, res, next) {
  // Get the token from the header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretText, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
