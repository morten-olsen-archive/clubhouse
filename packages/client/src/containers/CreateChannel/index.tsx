import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import ReactDropzone from 'react-dropzone';
import { useIdentities, useChannels } from 'clubhouse-hooks';

const CreateIdentity = withRouter(({
  history,
}) => {
  const [name, setName] = useState('');
  const { identities } = useIdentities();
  const { createChannel, addChannel } = useChannels();
  return (
    <div>
      <input value={name} onChange={(evt) => setName(evt.target.value)} />
      <ReactDropzone
        onDrop={(files) => {
          const [key] = files;
          const reader = new FileReader();
          reader.onload = async (evt: any) => {
            if (!evt.target || !evt.target.result || evt.target.readyState !== 2) {
              return;
            }
            const data = JSON.parse(evt.target.result.toString());
            addChannel(name, identities[0].id, data.invite, data.sender);
          };
          reader.readAsText(key);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag n drop some files here, or click to select files</p>
          </div>
        )}
      </ReactDropzone>
      <button
        type="button"
        onClick={async () => {
          const id = await createChannel(identities[0].id, name);
          history.push(`/channel/${id}`);
        }}
      >
        Create
      </button>
    </div>
  );
});

export default CreateIdentity;
