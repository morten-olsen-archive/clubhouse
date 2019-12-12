import * as openpgp from 'openpgp';

export const isUser = (keyId: any, key: openpgp.key.Key) => {
  const { bytes } = keyId;
  return key.getKeyIds().filter(k => k.bytes === bytes).length > 0;
}

export const findUser = (keyId: any, keys: openpgp.key.Key[]) => {
  return keys.find(key => isUser(keyId, key));
}

export const describeUser = (keyId: any, keys: openpgp.key.Key[]) => {
  const result = keys.find(key => isUser(keyId, key));
  return createDescription(result, keyId);
}

export const createDescription = (key: openpgp.key.Key | undefined, id: { bytes: string}) => {
  return {
    fingerprint: key ? key.getFingerprint() : undefined,
    id: id.bytes,
  };
};