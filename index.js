const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const PORT = process.env.PORT || 5000;

(async function () {
  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    schema,
  });

  await server.start();
  // This middleware should be added before calling `applyMiddleware`.

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });
  app.use("/static", express.static(path.join(__dirname, "public")));
  app.use(cors());

  mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("MongoDB Connected");
    })
    .then(() => {
      console.log(
        `🚀 and running on http://localhost:${PORT}${server.graphqlPath}`
      );
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
