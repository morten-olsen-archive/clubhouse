import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Body } from '../../typography';

export enum Type {
  primary = 'PRIMARY',
  secondary = 'SECONDARY',
  destructive = 'DESTRUCTIVE',
}

export interface Props {
  title: string;
  onPress?: () => {}
}

const Wrapper = styled.div`
  background: red;
  color: #fff;
  display: inline-block;
  padding: 10px;
  cursor: pointer;
  border-radius: 3px;

  &:active {
    background: green;
  }
`;

const Button: FunctionComponent<Props> = ({
  title,
  onPress,
}) => (
  <Wrapper
    role="button"
    onClick={onPress}
  >
    <Body>{title}</Body>
  </Wrapper>
);

export default Button;
