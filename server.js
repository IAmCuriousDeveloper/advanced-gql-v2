//demo

const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: String!
  }

  type Settings {
    user: User!
    theme: String!
  }

  input newSettingsInput {
    user: ID!
    theme: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: newSettingsInput): Settings!
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        id: 1,
        username: "Prashant Rawal",
        createdAt: "morning",
      };
    },
    settings(_, { user }) {
      return {
        user,
        theme: "light",
      };
    },
  },
  Mutation: {
    settings(_, { input }) {
      return {
        input,
      };
    },
  },
  // resolving types (usually we resolve the relational types here settings is related to user so we did that)
  Settings: {
    user(settings) {
      return {
        id: 1,
        username: "Prashant Rawal",
        createdAt: "morning",
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) =>
    console.log(`server is running on  localhost:4000 ${url}`)
  );
