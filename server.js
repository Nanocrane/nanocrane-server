const express = require("express");
const { createMollieClient } = require("@mollie/api-client");

const app = express();

const PORT = process.env.PORT || 3000;

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY
});

let muntKlaar = false;


// Testpagina
app.get("/", (req, res) => {
  res.send("Nanocrane server werkt!");
});


// Maak een betaling
app.get("/betalen", async (req, res) => {

  try {

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: "2.00"
      },
      description: "Nanocrane spel",
      redirectUrl: "https://nanocrane-server-production.up.railway.app/betaald",
      webhookUrl: "https://nanocrane-server-production.up.railway.app/webhook"
    });

    res.redirect(payment.getCheckoutUrl());

  } catch (error) {

    console.log(error);
    res.status(500).send("Fout bij betaling maken");

  }

});


// Test: munt klaar zetten
app.get("/betaald", (req, res) => {

  muntKlaar = true;

  res.send("Betaling ontvangen");

});


// Mollie meldt hier de echte betaling
app.post("/webhook", express.urlencoded({ extended: true }), (req, res) => {

  console.log("Webhook ontvangen");

  muntKlaar = true;

  res.send("OK");

});


// ESP32 controleert hier
app.get("/munt", (req, res) => {

  if (muntKlaar) {

    muntKlaar = false;
    res.send("JA");

  } else {

    res.send("NEE");

  }

});


app.listen(PORT, () => {
  console.log("Server gestart op poort " + PORT);
});
