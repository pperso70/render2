const express = require("express");
const { WebSocketServer } = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get("/", (req, res) => {
  res.send("Serveur WebSocket actif");
});

wss.on("connection", (ws) => {
  console.log("Nouvelle connexion établie");

  ws.on("message", (message) => {
    if (message.length < 100) {
      console.log("Message texte reçu: taille:", message.length, "bytes");
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(message.toString());
        }
      });
    } else {
      console.log("Image reçue, taille:", message.length, "bytes");
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(message);
        }
      });
    }
  });

  ws.on("close", () => console.log("Client déconnecté"));
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});