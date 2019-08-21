import { useContext, useState, useEffect } from 'react';
import context from '../context';

const useIntroductions = (channel: string) => {
  const [cache, setCache] = useState<any[]>([]);
  const { db } = useContext(context);

  if (!db) {
    return {
      getInfo: (a: string) => a,
    }
  }

  useEffect(() => {
    const subscription = db.introductions.find({ channel }).$.subscribe((items) => {
      setCache(items.map((item) => ({
        id: item.fingerprint,
        name: item.name,
      })));
    });
    return () => {
      subscription.unsubscribe();
    }
  }, [channel]);

  const getInfo = (fingerprint?: string) => {
    if (!fingerprint) {
      return 'system';
    }
    const item = cache.find(item => item.id === fingerprint);
    if (item) {
      return item.name;
    }
    return fingerprint;
  };

  return {
    getInfo,
  };
};

export default useIntroductions;
