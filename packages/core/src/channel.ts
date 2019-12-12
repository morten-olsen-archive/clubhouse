import * as openpgp from 'openpgp';
import ChannelConfig from './types/ChannelConfig';
import Transporter from './types/Transporter';
import { hash, hmac } from './helpers/crypto';

const getRawData = async (id: string, transporter: Transporter) => {
  const exists = await transporter.exists(id);
  if (exists) {
    const rawData = await transporter.get(id);
    return rawData;
  }
}

const decrypt = async (rawData: string, channelKey: string) => {
  const channelPackage = await openpgp.decrypt({
    message: await openpgp.message.readArmored(rawData),
    passwords: [channelKey],
  });
  return channelPackage.data as string;
}

const encrypt = async (data: string, channelKey: string) => {
  const packed = await openpgp.encrypt({
    message: openpgp.message.fromText(data),
    passwords: [channelKey],
  });
  return packed.data;
}

const getPackage = async (config: ChannelConfig, transporter: Transporter) => {
  const data = await getRawData(config.keys.nextId, transporter);
  if (!data) {
    return {
      newConfig: config,
    };
  }
  const rawData = await transporter.get(config.keys.nextId);
  const channelPackage = await decrypt(rawData, config.keys.nextChannelKey);

  const newConfig: ChannelConfig = {
    ...config,
    keys: {
      nextId: hmac(config.keys.nextId, config.keys.nextIdKey),
      nextIdKey: hash(config.keys.nextIdKey),
      nextChannelKey: hash(config.keys.nextChannelKey),
    },
  };

  return {
    newConfig,
    pkg: channelPackage,
  }
}

const getPackages = async (config: ChannelConfig, transporter: Transporter) => {
  const pkgs: string[] = [];
  let currentConfig = config;
  while (true) {
    const { newConfig, pkg } = await getPackage(currentConfig, transporter);
    if (!pkg) {
      return {
        pkgs,
        newConfig,
      };
    }
    currentConfig = newConfig;
    pkgs.push(pkg);
  };
};

const send = async (data: string, config: ChannelConfig, transporter: Transporter) => {
  const before = await getPackages(config, transporter);
  const packed = await encrypt(data, before.newConfig.keys.nextChannelKey);
  await transporter.set(before.newConfig.keys.nextId, packed);
  const after = await getPackages(before.newConfig, transporter);
  return {
    newConfig: after.newConfig,
    pkgs: [
      ...before.pkgs,
      ...after.pkgs,
    ],
  };
};

const createConfig = async (): Promise<ChannelConfig> => {
  return {
    keys: {
      nextChannelKey: 'a',
      nextId: 'b',
      nextIdKey: 'c',
    }
  }
};

export {
  encrypt,
  decrypt,
  getPackage,
  getPackages,
  send,
  createConfig,
};