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
    updatePerson: (_, { id, firstName, lastName }) => {
      const person = people.find(person => person.id === id);
      person.firstName = firstName;
      person.lastName = lastName;
      return person;
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
    updateCar: (_, { id, year, make, model, price, personId }) => {
      const car = cars.find(car => car.id === id);
      car.year = year;
      car.make = make;
      car.model = model;
      car.price = price;
      car.personId = personId;
      return car;
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
