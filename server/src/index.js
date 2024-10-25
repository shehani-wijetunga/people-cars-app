const { ApolloServer, gql } = require('apollo-server');
const { people, cars } = require('./schema');

// Define GraphQL schema
const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  type Query {
    people: [Person]
    person(id: ID!): Person
    cars: [Car]
  }

  type Mutation {
    createPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: ID!, firstName: String!, lastName: String!): Person
    deletePerson(id: ID!): Person
    createCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    updateCar(id: ID!, year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    deleteCar(id: ID!): Car
  }
`;

// Resolvers to handle GraphQL requests
const resolvers = {
  Query: {
    people: () => people,
    person: (parent, args) => people.find((p) => p.id === args.id),
    cars: () => cars,
  },
  Mutation: {
    createPerson: (parent, args) => {
      const newPerson = { id: `${people.length + 1}`, ...args };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (parent, args) => {
      const personIndex = people.findIndex((p) => p.id === args.id);
      if (personIndex > -1) {
        people[personIndex] = { ...people[personIndex], ...args };
        return people[personIndex];
      }
    },
    deletePerson: (parent, args) => {
      const personIndex = people.findIndex((p) => p.id === args.id);
      if (personIndex > -1) {
        const removed = people.splice(personIndex, 1);
        return removed[0];
      }
    },
    createCar: (parent, args) => {
      const newCar = { id: `${cars.length + 1}`, ...args };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (parent, args) => {
      const { id, year, make, model, price } = args;
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex !== -1) {
        cars[carIndex] = { ...cars[carIndex], year, make, model, price };
        return cars[carIndex];
      }
      throw new Error('Car not found');
    },
    deleteCar: (parent, args) => {
      const carIndex = cars.findIndex((c) => c.id === args.id);
      if (carIndex > -1) {
        const removed = cars.splice(carIndex, 1);
        return removed[0];
      }
    },
  },
  Person: {
    cars: (parent) => cars.filter((car) => car.personId === parent.id),
  },
};

// Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
