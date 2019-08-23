import styled from 'styled-components';

interface Props {
  size: number;
}

const Image = styled.img<{
  size: number;
}>`
  background: red;
  border-radius: 50%;
  width: ${(props) => props.size}px; 
  heigth: ${(props) => props.size}px; 
`;

export default Image;
