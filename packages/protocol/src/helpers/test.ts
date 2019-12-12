import { identity, Keyring, Transporter } from '@morten-olsen/clubhouse-core';

export const createEnv = async (userCount: number) => {
  const users = await Promise.all(new Array(userCount).fill(undefined).map(async () => {
    const key = await identity.create();
    let config: any = undefined;
    return {
      identity: key,
      publicKey: key.toPublic().armor(),
      getConfig: async () => config,
      setConfig: async (newConfig: any) => { config = newConfig},
    };
  }));
  const keyring = new Keyring();
  await keyring.addKeys(users.map(u => u.publicKey));
  const data: {[id: string]: string} = {};
  const transporter: Transporter = {
    exists: async id => !!data[id],
    get: async id => data[id],
    set: async (id, value) => { data[id] = value },
  }
  return {
    data,
    transporter,
    users,
    keyring,
  };
}

type PromiseType<T> = T extends Promise<infer U> ? U : never;
export type EnvType = PromiseType<ReturnType<typeof createEnv>>;