import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    /* 폰트 설정 */
  }
`