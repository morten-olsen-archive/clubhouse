import { useContext } from 'react';
import context from '../context';

const useChannels = () => {
  const {
    channels,
    createChannel,
  } = useContext(context);

  return {
    channels: channels || [],
    createChannel,
  };
};

export default useChannels;
