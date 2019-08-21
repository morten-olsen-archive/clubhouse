import React, { ReactNode, FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import {
  Body,
} from '../../typography';

const Wrapper = styled.div`
  position: relative;
  min-width: 100px;
`;

const Items = styled.div`
  position: absolute;
  width: 100%;
  top: 100%;
`;

const Item = styled.div`
  cursor: pointer;
  width: 100%;
  &:hover {
    background: red;
  }
`;

interface Props<Type = any> {
  items: Type[];
  selected?: number;
  render: (item: Type) => ReactNode;
  noSelection?: ReactNode;
  onSelect: (item: Type) => void;
}

const Dropdown: FunctionComponent<Props> = ({
  items,
  selected = -1,
  render,
  noSelection = <Body>...select</Body>,
  onSelect,
}) => {
  const [visible, setVisible] = useState(false);
  const selectedItem = items[selected];
  return (
    <Wrapper>
      <Item
        onClick={() => {
          setVisible(true);
        }}
      >
        {selectedItem ? render(selectedItem) : noSelection}
      </Item>
      {visible && (
        <Items>
          {items.map((item) => (
            <Item
              key={item.id}
              onClick={() => {
                onSelect(item);
                setVisible(false);
              }}
            >
              {render(item)}
            </Item>
          ))}
        </Items>
      )}
    </Wrapper>
  );
};

export default Dropdown;