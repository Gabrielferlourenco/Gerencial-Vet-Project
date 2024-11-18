const express = require("express");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize"); // Adicionando o Sequelize
const app = express();
const port = 3030;

// Configuração do Sequelize
const sequelize = new Sequelize("petshop", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

const Pet = sequelize.define(
  "Pet", // Cria a tabela Pets no MySQL
  {
    petName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    species: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    breed: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.INTEGER,
    },
    ownerName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contact: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desativa a criação de createdAt e updatedAt
  }
);

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware para processar dados JSON no corpo da requisição
app.use(express.json());

// Rota principal para o formulário
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rota para cadastro de pet
app.post("/cadastro", async (req, res) => {
  try {
    const { petName, species, breed, age, ownerName, contact } = req.body;

    // Criando um novo pet no banco de dados
    const newPet = await Pet.create({
      petName,
      species,
      breed,
      age,
      ownerName,
      contact,
    });

    res
      .status(201)
      .json({ message: "Pet cadastrado com sucesso!", pet: newPet });
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    res.status(500).json({ message: "Erro ao cadastrar pet." });
  }
});

// Sincronizando o banco de dados
sequelize
  .sync()
  .then(() => console.log("Banco de dados sincronizado"))
  .catch((error) =>
    console.error("Erro ao sincronizar o banco de dados:", error)
  );

// Rota para exibir os dados em JSON
app.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets);
  } catch (error) {
    res.status(500).send("Erro ao carregar os dados.");
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
