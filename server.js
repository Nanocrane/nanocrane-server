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

  res.send(`
    <h1>🎉 Bedankt voor je betaling!</h1>
    <h2>Veel plezier met spelen.</h2>
    <p>De Nanocrane start nu.</p>
  `);

});


// Mollie meldt hier de echte betaling
app.post("/webhook", express.urlencoded({ extended: true }), async (req, res) => {

  try {

    const paymentId = req.body.id;

    console.log("Webhook ontvangen:", paymentId);

    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status === "paid") {

      console.log("Betaling goedgekeurd");

      muntKlaar = true;

    } else {

      console.log("Betaling niet betaald:", payment.status);

    }

    res.send("OK");

  } catch (error) {

    console.log(error);
    res.status(500).send("Fout");

  }

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
