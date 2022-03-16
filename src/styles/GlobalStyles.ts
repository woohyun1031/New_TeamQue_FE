import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #FAFAFA;
    /* 폰트 설정 */
    font-family: "Roboto", sans-serif;
    font-weight: 900;
    color: #181B23;
  }
`;