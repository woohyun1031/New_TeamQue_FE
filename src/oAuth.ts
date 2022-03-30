import axios from "axios";

const url = 'https://noobpro.shop';

//api instance 생성
export const api = axios.create({
	baseURL: url,
});

//kakao social login 인가코드 받기
const KAKAO_ID = 'none';
const KAKAO_REDIRECT_URI = 'http://localhost:3000/auth/kakao/callback';

export const KAKAO_API_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
