import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

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
  mutation UpdateCar($id: ID!, $year: Int!, $make: String!, $model: String!, $price: Float!) {
    updateCar(id: $id, year: $year, make: $make, model: $model, price: $price) {
      id
      year
      make
      model
      price
    }
  }
`;


function CarCard({ car }) {
  const [isEditing, setIsEditing] = useState(false);
  const [year, setYear] = useState(car.year);
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [price, setPrice] = useState(car.price);
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
        year: parseInt(year),  // Ensure this is an integer
        make,
        model,
        price: parseFloat(price),  // Ensure this is a float
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
