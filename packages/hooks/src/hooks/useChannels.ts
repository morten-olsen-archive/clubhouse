import { useContext } from 'react';
import context from '../context';

const useChannels = () => {
  const {
    channels,
    createChannel,
    addChannel,
  } = useContext(context);

  return {
    channels: channels || [],
    createChannel,
    addChannel,
  };
};

export default useChannels;
