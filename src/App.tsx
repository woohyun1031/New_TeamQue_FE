import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Modal from './components/modal/Modal';
import ClassHome from './pages/ClassHome';
import ClassRoom from './pages/ClassRoom';
import Main from './pages/Main';
import Kakao from './pages/Kakao';
import { changeModal, closeModal, openModal } from './store/modules/modal';
import GlobalStyle from './styles/GlobalStyle';
import { getUser } from './store/modules/user';

const App = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// redux 로직에 추가
	const isToken = sessionStorage.getItem('accessToken') ? true : false;
	console.log(1)
	useEffect(() => {
		if (isToken) {
			dispatch(closeModal())
			dispatch(getUser())
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
				<Route path='/auth/kakao/callback' element={<Kakao />}/>
			</Routes>
			<Modal />
		</>
	);
};

export default App;
