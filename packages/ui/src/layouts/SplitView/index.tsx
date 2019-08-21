import React, { ReactNode, FunctionComponent } from 'react';
import styled from 'styled-components';

export interface Props {
  children: [ReactNode, ReactNode];
}

const Wrapper = styled.div`
  display: flex;
  background: red;
  flex: 1;
`;

const Side = styled.aside`
  width: 250px;
  background: yellow;
  overflow-y: auto;
`;

const Main = styled.div`
  flex: 1;
`;

const SplitView: FunctionComponent<Props> = ({
  children,
}) => {
  const [side, main] = children;
  return (
    <Wrapper>
      <Side>{side}</Side>
      <Main>{main}</Main>
    </Wrapper>
  )
}

export default SplitView;