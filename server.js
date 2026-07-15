const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

let muntKlaar = false;

// Testpagina
app.get("/", (req, res) => {
  res.send("Nanocrane server werkt!");
});

// Hiermee zetten we een munt klaar
app.get("/betaald", (req, res) => {
  muntKlaar = true;
  console.log("Betaling ontvangen");
  res.send("Munt klaargezet");
});

// ESP32 vraagt hier of er een munt is
app.get("/munt", (req, res) => {

  if (muntKlaar) {
    muntKlaar = false;
    console.log("Munt gegeven");
    res.send("JA");
  } else {
    res.send("NEE");
  }

});

app.listen(PORT, () => {
  console.log("Server gestart op poort " + PORT);
});
