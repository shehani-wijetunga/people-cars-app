import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// GraphQL mutation to delete a car
const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
    }
  }
`;

// GraphQL mutation to update a car
const UPDATE_CAR = gql`
  mutation UpdateCar($id: ID!, $year: Int!, $make: String!, $model: String!, $price: Float!, $personId: ID!) {
    updateCar(id: $id, year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

// GraphQL query to get all people for the dropdown
const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
    }
  }
`;

function CarCard({ car }) {
  const [isEditing, setIsEditing] = useState(false);
  const [year, setYear] = useState(car.year);
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [price, setPrice] = useState(car.price);
  const [personId, setPersonId] = useState(car.personId);
  const { data: peopleData } = useQuery(GET_PEOPLE);
  const [deleteCar] = useMutation(DELETE_CAR, {
    refetchQueries: ['GetPeopleAndCars'],
  });
  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: ['GetPeopleAndCars'],
  });

  const handleDelete = () => {
    deleteCar({ variables: { id: car.id } });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateCar({
      variables: {
        id: car.id,
        year: parseInt(year), 
        make,
        model,
        price: parseFloat(price),  
        personId,
      },
    });
    setIsEditing(false);
  };
  

  return (
    <li>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
            type="number"
            placeholder="Price"
          />
           <select value={personId} onChange={(e) => setPersonId(e.target.value)}>
            <option value="">Select Person</option>
            {peopleData?.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          {car.year} {car.make} {car.model} - ${car.price}
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
    </li>
  );
}

export default CarCard;
