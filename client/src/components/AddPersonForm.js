import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_PERSON = gql`
  mutation CreatePerson($firstName: String!, $lastName: String!) {
    createPerson(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

function AddPersonForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [createPerson] = useMutation(ADD_PERSON);

  const handleSubmit = (e) => {
    e.preventDefault();
    createPerson({ variables: { firstName, lastName } });
    setFirstName('');
    setLastName('');
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Add Person</button>
    </form>
  );
}

export default AddPersonForm;
