const mongoose = require("mongoose");

const roupaSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, "A marca é obrigatória."],
      trim: true,
      minlength: [1, "A marca não pode ficar vazia."]
    },
    modelo: {
      type: String,
      required: [true, "O modelo é obrigatório."],
      trim: true,
      minlength: [1, "O modelo não pode ficar vazio."]
    },
    preco: {
      type: Number,
      required: [true, "O preço é obrigatório."],
      min: [0.01, "O preço deve ser maior que zero."]
    },
    foto: {
      type: String,
      required: [true, "A URL da foto é obrigatória."],
      trim: true,
      validate: {
        validator: (value) => {
          try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        },
        message: "Informe uma URL válida começando com http:// ou https://."
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Roupa || mongoose.model("Roupa", roupaSchema);
