import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Switch, Route, Link } from 'react-router-dom';
import AddPersonForm from './components/AddPersonForm';
import AddCarForm from './components/AddCarForm';
import PersonCard from './components/PersonCard';

// GraphQL Queries
const GET_PEOPLE_AND_CARS = gql`
  query GetPeopleAndCars {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_PEOPLE_AND_CARS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="App">
      <h1>People and Cars</h1>
      <Link to="/">Home</Link>

      <Switch>
        <Route exact path="/">
          <AddPersonForm />
          <AddCarForm />
          <div>
            {data.people.map(person => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
