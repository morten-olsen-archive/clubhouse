import React, { FunctionComponent, useState } from 'react';
import ReactDropzone from 'react-dropzone';
import { useIdentities, useChannel } from 'clubhouse-hooks';
import { withRouter } from 'react-router';

const CreateIdentity = withRouter(({
  match,
  history,
}) => {
  const channelId = match.params.channel;
  const { createIdentity } = useIdentities();
  const { channel } = useChannel(channelId);
  if (!channel) {
    return null;
  }
  return (
    <div>
      <ReactDropzone
        onDrop={(files) => {
          const [key] = files;
          const reader = new FileReader();
          reader.onload = (evt) => {
            if(evt.target.readyState != 2) {
              return;
            }
            channel.channel.send({
              type: 'ADD_MEMBER',
              key: evt.target.result,
            }).then(() => {
              history.push(`/channel/${channelId}`);
            });
          };
          reader.readAsText(key);
        }}
      >
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </ReactDropzone>
    </div>
  );
});

export default CreateIdentity;