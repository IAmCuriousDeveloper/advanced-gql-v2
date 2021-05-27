//demo

const {
  ApolloServer,
  PubSub,
  AuthenticationError,
  UserInputError,
  ApolloError,
} = require("apollo-server");
const gql = require("graphql-tag");

const pubSub = new PubSub();
const NEW_ITEM = "NEW_ITEM";
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: String!
    error: String!
  }

  type Settings {
    user: User!
    theme: String!
  }

  type Item {
    task: String!
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
    createItem(task: String!): Item!
  }

  type Subscription {
    newItem: Item
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
    createItem(_, { task }) {
      let Item = { task };
      pubSub.publish(NEW_ITEM, { newItem: Item });
      return Item;
    },
  },

  Subscription: {
    newItem: {
      subscribe: () => pubSub.asyncIterator(NEW_ITEM),
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
  User: {
    error() {
      throw new AuthenticationError("not auth");
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ connection }) {
    if (connection) {
      return { ...connection.context };
    }
  },
  subscriptions: {
    onConnect(params) {},
  },
});

server
  .listen()
  .then(({ url }) =>
    console.log(`server is running on  localhost:4000 ${url}`)
  );
