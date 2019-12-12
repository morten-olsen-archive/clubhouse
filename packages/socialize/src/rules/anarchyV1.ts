import { RuleRunner } from '../types';

const anarchyV1: RuleRunner<any, any, any> = async ({
  config,
  message: { message },
  setConfig,
}) => {
  switch (message.type) {
    case 'ADD_MEMBER': {
      await setConfig({
        ...config,
        members: [
          ...config.members,
          message.publicKey,
        ],
      });
      break;
    }
    case 'CHANGE_TYPE': {
      await setConfig({
        ...config,
        ruleName: message.ruleType,
      });
      break;
    }
    default: break;
  }
  return message;
};

export default anarchyV1;
