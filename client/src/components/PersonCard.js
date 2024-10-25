import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import CarCard from './CarCard';

// GraphQL mutation to delete a person
const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

// GraphQL mutation to update a person
const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $firstName: String!, $lastName: String!) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

function PersonCard({ person }) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(person.firstName);
  const [lastName, setLastName] = useState(person.lastName);
  const [deletePerson] = useMutation(DELETE_PERSON, {
    refetchQueries: ['GetPeopleAndCars'],
  });
  const [updatePerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: ['GetPeopleAndCars'],
  });

  const handleDelete = () => {
    deletePerson({ variables: { id: person.id } });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updatePerson({ variables: { id: person.id, firstName, lastName } });
    setIsEditing(false);
  };

  return (
    <div className="person-card">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <h2>{person.firstName} {person.lastName}</h2>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      <ul>
        {person.cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </ul>
      <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
    </div>
  );
}

export default PersonCard;
