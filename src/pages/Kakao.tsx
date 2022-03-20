import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../oAuth';
import { useNavigate } from 'react-router-dom';
import FirstJoin from '../components/FirstJoin';
import { AppDispatch } from '../store/configStore';

const Kakao = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const [first, setFirst] = React.useState(false); //가입 시첨 체크
	const authorization_code = new URL(window.location.href).searchParams.get(
		'code'
	);

	useEffect(() => {
		//kakao 인가코드 백으로 넘기기
		console.log('kakaologin start');
		dispatch(kakaoLogin(authorization_code))
	}, []);

	//kakao social 로그인
	const kakaoLogin = (authorization_code: any) => {
		return async function () {
			await api
				.get(`/auth/kakao/callback?code=${authorization_code}`)
				.then((response) => {
					const nickname = response.data.nickname;
					const accessToken = response.data.accessToken;
					const refreshToken = response.data.refreshToken;

					sessionStorage.setItem('nickname', `${nickname}`);
					sessionStorage.setItem('accessToken', `${accessToken}`);
					sessionStorage.setItem('refreshToken', `${refreshToken}`);
				})
				.then(() => {
					if (sessionStorage.getItem('nickname') === undefined) {
						setFirst(false);
						navigate('/');

					} else {
						setFirst(true);
						navigate('/');
					}
				})
				.catch((err) => {
					console.log('카카오 로그인실패', err);
				});
		};
	};

	return <>{first ? <FirstJoin /> : <h1>Loading</h1>}</>;
};
export default Kakao;
