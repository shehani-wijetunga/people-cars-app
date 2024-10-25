import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

const ADD_CAR = gql`
  mutation CreateCar($year: Int!, $make: String!, $model: String!, $price: Float!, $personId: ID!) {
    createCar(year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const GET_PEOPLE = gql`
  query {
    people {
      id
      firstName
      lastName
    }
  }
`;

function AddCarForm() {
  const { data } = useQuery(GET_PEOPLE);
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [personId, setPersonId] = useState('');
  const [createCar] = useMutation(ADD_CAR);

  const handleSubmit = (e) => {
    e.preventDefault();
    createCar({ variables: { year: parseInt(year), make, model, price: parseFloat(price), personId } });
    setYear('');
    setMake('');
    setModel('');
    setPrice('');
    setPersonId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        type="number"
      />
      <input
        value={make}
        onChange={(e) => setMake(e.target.value)}
        placeholder="Make"
      />
      <input
        value={model}
        onChange={(e) => setModel(e.target.value)}
        placeholder="Model"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
      />
      <select value={personId} onChange={(e) => setPersonId(e.target.value)}>
        <option value="">Select Person</option>
        {data?.people.map(person => (
          <option key={person.id} value={person.id}>
            {person.firstName} {person.lastName}
          </option>
        ))}
      </select>
      <button type="submit">Add Car</button>
    </form>
  );
}

export default AddCarForm;
