import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import {
  Body,
} from '../../typography';

export interface Props {
}

const Wrapper = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 1;
`;

const Header: FunctionComponent<Props> = ({
}) => {
  return (
    <Wrapper>
      <Main>
        <Body>Hello</Body>
      </Main>
    </Wrapper>
  );
};

export default Header;