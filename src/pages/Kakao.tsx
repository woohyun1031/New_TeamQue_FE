import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import apis from '../api';
import { instance } from '../api';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/configStore';
import { kakaoLogin } from '../store/modules/user';

const Kakao = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const authorization_code = new URL(window.location.href).searchParams.get(
		'code'
	);

	useEffect(() => {
		console.log('kakaologin start');
		dispatch(kakaoLogin(authorization_code));
	}, []);

	return null;
};
export default Kakao;
