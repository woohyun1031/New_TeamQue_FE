import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;  
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
  }
  body {
    background-color: #F8F8F8;
  }
  li {
    list-style: none;
  }
  button {
    background: none;
    border: none;
    cursor: pointer;
  }
  input {
    border: none;
    outline: none;
  }
  label {
    display: block;
  }
`;

export default GlobalStyle;
