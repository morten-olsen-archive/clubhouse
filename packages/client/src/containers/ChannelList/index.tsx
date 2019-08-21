import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useChannels, useIdentities } from 'clubhouse-hooks';
import { layouts } from 'clubhouse-ui';
import { download } from '../../helpers/document';

const { Channel } = layouts;

const ChannelList = withRouter(({
  history,
}) => {
  const { identities } = useIdentities();
  const { channels } = useChannels();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          history.push('/channel-create');
        }}
      >
        Create
      </button>
      <button
        type="button"
        onClick={() => {
          download(identities[0].identity.publicKey.armor(), 'octo/any');
        }}
      >
        Download Identity
      </button>
      {channels.map((channel) => (
        <Link key={channel.id} to={`/channel/${channel.id}`}>
          <Channel
            id={channel.id}
            name={channel.name}
          />
        </Link>
      ))}
    </div>
  );
});

export default ChannelList;
