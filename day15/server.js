// server.js
const express = require("express");
const postRouter = require("./routes/post");

const app = express();
app.use(express.json());

app.use("/api/v1", postRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
