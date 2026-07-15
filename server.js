const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Testpagina
app.get("/", (req, res) => {
  res.send("Nanocrane server werkt!");
});

app.listen(PORT, () => {
  console.log("Server gestart op poort " + PORT);
});
