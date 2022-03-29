import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;  
    /* body 태그에 지정하는 법 찾기 */
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
  }
  body {
    background-color: #F8F8F8;
  }
  img {
    /* 정확한 의미 찾기 */
    vertical-align: middle;
  }
  li {
    list-style: none;
  }
`;

export default GlobalStyle;
