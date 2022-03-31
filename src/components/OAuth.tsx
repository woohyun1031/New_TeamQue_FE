import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { authLogin } from '../store/modules/user';

const OAuth = () => {
	const dispatch = useDispatch();
	const { accessToken, refreshToken } = useParams();
	useEffect(() => {
		dispatch(authLogin({ accessToken, refreshToken}));
	});
	return null;
};

export default OAuth;
