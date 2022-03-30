import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import apis from '../api';
import { instance } from '../api';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/configStore';

const Kakao = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const authorization_code = new URL(window.location.href).searchParams.get(
		'code'
	);

	useEffect(() => {
		//kakao 인가코드 백으로 넘기기
		console.log('kakaologin start');
		dispatch(kakaoLogin(authorization_code));
	}, []);

	//kakao social 로그인
	const kakaoLogin = (authorization_code: any) => {
		return async () => {
			try {
				const { data } = await apis.kakaoLogin(authorization_code);
				sessionStorage.setItem('nickname', `${data.data.nickname}`);
				sessionStorage.setItem('accessToken', `${data.data.accessToken}`);
				sessionStorage.setItem('refreshToken', `${data.data.refreshToken}`);

				instance.defaults.headers.common[
					'Authorization'
				] = `Bearer ${sessionStorage.getItem('accessToken')}`;
				return data;
			} catch (error) {
				console.log(error, 'error');
			}
		};
	};

	//return <>{first ? <FirstJoin /> : <h1>Loading</h1>}</>;
	return (
		<>
			<h1>Loading</h1>
		</>
	);
};
export default Kakao;
