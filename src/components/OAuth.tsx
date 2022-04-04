import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { authLogin } from '../store/modules/user';

const OAuth = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	
	const tokens: {[tokenName: string]: string} = {};
	location.search
		.slice(1)
		.split('&')
		.map((query) => query.split('='))
		.forEach(([key, value]) => {
			tokens[key] = value;
		});
		
	useEffect(() => {
		dispatch(authLogin(tokens));
	}, []);
	return null;
};

export default OAuth;
