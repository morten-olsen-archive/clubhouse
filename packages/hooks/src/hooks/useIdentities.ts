import { useContext } from 'react';
import context from '../context';

const useIdentities = () => {
  const {
    identities,
    createIdentity,
  } = useContext(context);

  return {
    identities: identities || [],
    createIdentity,
  };
};

export default useIdentities;
