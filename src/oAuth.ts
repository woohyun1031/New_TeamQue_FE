import axios from "axios";

const url = 'https://noobpro.shop';

//api instance 생성
export const api = axios.create({
	baseURL: url,
});

//kakao social login 인가코드 받기
const KAKAO_ID = '2161226dcbb0f02963a2cdb86da38d87';
const KAKAO_REDIRECT_URI = 'http://localhost:3000/auth/kakao/callback';

export const KAKAO_API_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
