import * as openpgp from 'openpgp';
import { describeUser } from './helpers/key';

const getKeys = async (pubs: string[]) => {
  const keys = await Promise.all(pubs.map(key => openpgp.key.readArmored(key)));
  return keys.map(key => key.keys[0]);
}

export const encrypt = async (data: any, sender: openpgp.key.Key, receivers: string[]) => {
  const raw = JSON.stringify(data);
  const receiverKeys = await getKeys(receivers);
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(raw),
    publicKeys: receiverKeys,
    privateKeys: [sender],
  });
  return encrypted.data;
}

export const decrypt = async (data: string, senders: string[], receiver: openpgp.key.Key) => {
  const senderKeys = await getKeys(senders);
  const message = await openpgp.message.readArmored(data);
  const decrypted = await openpgp.decrypt({
    message,
    publicKeys: senderKeys,
    privateKeys: [receiver],
  });
  const rawData = decrypted.data as string;
  
  const receiverIds = message.getEncryptionKeyIds();
  const receivers = receiverIds.map(id => describeUser(id, senderKeys));
  const sender = describeUser(decrypted.signatures[0].keyid, [
    ...senderKeys,
    receiver,
  ]);

  return {
    ...decrypted,
    data: decrypted.data as string,
    receivers,
    sender: sender,
    message: JSON.parse(rawData),
  }
}