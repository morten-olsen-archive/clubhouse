import React, { FunctionComponent } from 'react';

export interface Props {
  onPress?: (id: string) => {};
  selected?: boolean;
  id: string;
  name: string;
}

const Channel: FunctionComponent<Props> = ({
  name
}) => {
  return (
    <div>{name}</div>
  );
};

export default Channel;
