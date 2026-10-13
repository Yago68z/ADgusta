const express = require("express");
const mongoose = require("mongoose");
const Roupa = require("../models/Roupa");
const conectarBanco = require("../db");

const router = express.Router();

function validarId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function tratarErro(res, error) {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      erro: "Dados inválidos.",
      detalhes: error.message
    });
  }
  console.error(error);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}

router.get("/", async (req, res) => {
  try {
    await conectarBanco();
    const roupas = await Roupa.find().sort({ createdAt: -1 });
    res.json(roupas);
  } catch (error) {
    tratarErro(res, error);
  }
});

router.get("/:id", async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ erro: "ID inválido." });
  }
  try {
    await conectarBanco();
    const roupa = await Roupa.findById(req.params.id);
    if (!roupa) return res.status(404).json({ erro: "Roupa não encontrada." });
    res.json(roupa);
  } catch (error) {
    tratarErro(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    await conectarBanco();
    const { marca, modelo, preco, foto } = req.body || {};
    if (!marca?.trim?.() || !modelo?.trim?.() || preco === undefined || preco === "" || !foto?.trim?.()) {
      return res.status(400).json({ erro: "Informe marca, modelo, preço e URL da foto." });
    }
    const precoNumero = Number(preco);
    if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
      return res.status(400).json({ erro: "O preço deve ser um número maior que zero." });
    }
    const roupa = await Roupa.create({
      marca: marca.trim(),
      modelo: modelo.trim(),
      preco: precoNumero,
      foto: foto.trim()
    });
    res.status(201).json(roupa);
  } catch (error) {
    tratarErro(res, error);
  }
});

router.put("/:id", async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ erro: "ID inválido." });
  }
  try {
    await conectarBanco();
    const dados = {};
    for (const campo of ["marca", "modelo", "foto"]) {
      if (req.body?.[campo] !== undefined) {
        if (typeof req.body[campo] !== "string" || !req.body[campo].trim()) {
          return res.status(400).json({ erro: `O campo ${campo} não pode ficar vazio.` });
        }
        dados[campo] = req.body[campo].trim();
      }
    }
    if (req.body?.preco !== undefined) {
      const preco = Number(req.body.preco);
      if (!Number.isFinite(preco) || preco <= 0) {
        return res.status(400).json({ erro: "O preço deve ser um número maior que zero." });
      }
      dados.preco = preco;
    }
    const roupa = await Roupa.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true
    });
    if (!roupa) return res.status(404).json({ erro: "Roupa não encontrada." });
    res.json(roupa);
  } catch (error) {
    tratarErro(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ erro: "ID inválido." });
  }
  try {
    await conectarBanco();
    const roupa = await Roupa.findByIdAndDelete(req.params.id);
    if (!roupa) return res.status(404).json({ erro: "Roupa não encontrada." });
    res.json({ mensagem: "Roupa excluída com sucesso." });
  } catch (error) {
    tratarErro(res, error);
  }
});

module.exports = router;
