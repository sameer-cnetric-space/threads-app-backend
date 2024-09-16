import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import gqlServerinit from "./graphql";
import UserService from "./services/user";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  // GraphQL Server
  app.use(
    "/graphql",
    expressMiddleware(await gqlServerinit(), {
      context: async ({ req }) => {
        try {
          const authHeader = req.headers["authorization"];
          if (!authHeader) {
            throw new Error("Authorization header missing");
          }

          const token = authHeader.split(" ")[1];
          if (!token) {
            throw new Error("Authorization token missing");
          }
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
