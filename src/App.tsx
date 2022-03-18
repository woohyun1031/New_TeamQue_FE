import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Modal from './components/modal/Modal';
import ClassHome from './pages/ClassHome';
import ClassRoom from './pages/ClassRoom';
import Main from './pages/Main';
import { changeModal, closeModal, openModal } from './store/modules/modal';
import GlobalStyle from './styles/GlobalStyle';

const App = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// redux 로직에 추가
	const [isLogin, setIsLogin] = useState(false);
	const isToken = sessionStorage.getItem('accessToken') ? true : false;
	useEffect(() => {
		if (isToken) {
			setIsLogin(true);
			dispatch(closeModal());
		} else {
			navigate('/')
			dispatch(openModal());
			dispatch(changeModal('notSignIn'))
		}
	}, [dispatch, isToken, navigate]);
	return (
		<>
			<GlobalStyle />
			<Header />
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/classroom' element={<ClassRoom />} />
				<Route path='/classhome' element={<ClassHome />} />
			</Routes>
			<Modal />
		</>
	);
};

export default App;
