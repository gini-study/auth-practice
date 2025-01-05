import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const secretText = "superSecret";
const refreshSecretText = "supersuperSecret";

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
app.use(cookieParser());

let refreshTokens = [];
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  // Create a token (payload + secretText)
  const accessToken = jwt.sign(user, secretText, { expiresIn: "30s" });
  const refreshToken = jwt.sign(user, refreshSecretText, { expiresIn: "1d" });

  refreshTokens.push(refreshToken);

  // Send the token to the client side (cookie or local storage)
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ acessToken: accessToken });
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

app.get("/refresh", (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(403);

  const refreshToken = cookies.jwt;
  if (!refreshToken.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, refreshSecretText, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign({ name: user.name }, secretText, {
      expiresIn: "30s",
    });
    res.json({ accessToken });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
