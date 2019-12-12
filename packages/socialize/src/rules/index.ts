import { Rules, RuleRunner } from '../types';
import anarchyV1 from './anarchyV1';

const rules: {[name: string]: RuleRunner<any, any, any>} = {
  anarchyV1,
};

class DefaultRuleProvider implements Rules {
  get = async (name: string) => rules[name]
}

export default DefaultRuleProvider;
