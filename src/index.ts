import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import gqlServerinit from "./graphql";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  // GraphQL Server
  app.use("/graphql", expressMiddleware(await gqlServerinit()));

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
