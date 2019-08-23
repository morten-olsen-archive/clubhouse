import React, {FunctionComponent} from 'react';
import {
  Link,
  Body,
} from '../../../typography';
import styled from 'styled-components';

export interface Props {
  message: string;
  icon: string
}

const Wrapper = styled.div`
  padding: 10px 0;
  text-align: center;
`;

const Inner = styled.div`
  padding: 5px 15px;
  border-radius: 5px;
  display: inline-block;
`;

const MemberAdded: FunctionComponent<Props> = ({
  icon,
  message
}) => (
  <Wrapper>
    <Inner>
      <Body>
        {icon} {message}
      </Body>
    </Inner>
  </Wrapper>
);

export default MemberAdded;
