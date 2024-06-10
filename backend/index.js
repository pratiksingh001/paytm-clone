const express = require("express");
const cors = require('cors')

app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index.js")

const app = express();

// This is another way we can use app.use, app.use is used to create middlewares/or run middlewares before function
app.use("/api/v1", mainRouter);

app.listen(3000);

