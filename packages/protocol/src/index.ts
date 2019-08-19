import Identity from './Identity';
import Channel from './Channel';
import RuleSet from './RuleSet';
import Transporter from './Transporter';

const loadIdentity = Identity.open;
const createIdentity = Identity.create;

const loadChannel = Channel.load;
const createChannel = Channel.create;

export {
  Channel,
  Identity,
  RuleSet,
  loadIdentity,
  loadChannel,
  createIdentity,
  createChannel,
  Transporter,
};
