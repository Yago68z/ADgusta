require("dotenv").config();
const express = require("express");
const cors = require("cors");
const roupasRoutes = require("./routes/roupas");

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use(cors({
  origin: corsOrigin === "*" ? "*" : corsOrigin.split(",").map((item) => item.trim())
}));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    mensagem: "Fashion Catalog API funcionando.",
    endpoints: ["/roupas", "/roupas/:id"],
    status: "online"
  });
});

app.use("/roupas", roupasRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

module.exports = app;
