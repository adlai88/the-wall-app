import styled from 'styled-components';

const ModalCloseButton = styled.button`
  position: absolute;
  top: max(15px, env(safe-area-inset-top, 15px));
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2001;
  transition: background 0.15s, color 0.15s;
  &:hover, &:focus {
    color: #222;
    background: #f5f5f5;
    outline: none;
  }
`;

export default ModalCloseButton; 