import React, { FunctionComponent, useState } from 'react';
import { useIdentities } from 'clubhouse-hooks';

const CreateIdentity: FunctionComponent = () => {
  const [name, setName] = useState('');
  const { createIdentity } = useIdentities();
  return (
    <div>
      <input value={name} onChange={(evt) => setName(evt.target.value)} />
      <button
        type="button"
        onClick={() => {
          createIdentity(name);
        }}
      >
        Create
      </button>
    </div>
  );
};

export default CreateIdentity;
