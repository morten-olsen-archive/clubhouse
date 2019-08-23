import React, {FunctionComponent} from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  transform: scaleY(-1);
`;

interface Props {
  style?: any;
  children: ReactNode;
}

const ReverseList: FunctionComponent<Props> = ({
  style,
  children,
}) => {
  if (!children) {
    return null;
  }
  const elements = Array.isArray(children) ? [...children] : [children];
  return (
    <Wrapper style={style}>
      {elements.reverse().map((element, index) => {
        return (
          <Wrapper key={element.key || index}>
            {element}
          </Wrapper>
        );
      })}
    </Wrapper>
  );
};

export default ReverseList;
