import { useContext, useState, useEffect } from 'react';
import context from '../context';
import useChannel from './useChannel';
import { Message } from '../data/schemas/message';

const useMessages = (channelId: string) => {
  const {
    db,
  } = useContext(context);
  const { identity, channel } = useChannel(channelId);
  const [messages, setMessages] = useState<Message[]>();

  useEffect(() => {
    if (!db) return undefined;

    const subscriptions = db.messages.find({
      channel: channelId,
    }).sort({ received: 'desc' }).$.subscribe((elements) => {
      setMessages(elements);
    });

    return () => {
      subscriptions.unsubscribe();
    };
  }, [db, channelId]);

  return {
    channel,
    identity,
    messages,
  };
};

export default useMessages;
