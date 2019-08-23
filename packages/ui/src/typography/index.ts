import styled from 'styled-components';

const Base = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
`;

export const Body = styled(Base)`
  font-size: 13px;
`;

export const Label = styled(Base)`
  font-size: 10px;
`;

export const Link = styled(Base)`
  color: #3498db;
  cursor: pointer;
`;
