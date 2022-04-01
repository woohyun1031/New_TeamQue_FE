import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Modal from './components/modal/Modal';
import ClassHome from './pages/ClassHome';
import ClassRoom from './pages/ClassRoom';
import Main from './pages/Main';
import { changeModal, closeModal, openModal } from './store/modules/modal';
import GlobalStyle from './styles/GlobalStyle';
import { getUserInfo } from './store/modules/user';
import { RootState } from './store/configStore';
import OAuth from './components/OAuth';
import styled from 'styled-components';

const App = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLogin = useSelector((state: RootState) => state.user.isLogin);
	const isToken = sessionStorage.getItem('accessToken') ? true : false;

	useEffect(() => {
		if (isToken) {
			dispatch(closeModal());
			dispatch(getUserInfo());
		} else {
			navigate('/');
			dispatch(openModal());
			dispatch(changeModal('notSignIn'));
		}
	}, [isLogin, navigate]);

	return (
		<Container>
			<GlobalStyle />
			<Header />
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/classroom/:classid' element={<ClassRoom />} />
				<Route path='/classhome/:classid/:page' element={<ClassHome />} />
				<Route
					path='/classhome/:classid/post/:postid'
					element={<ClassHome />}
				/>
				<Route
					path='/classhome/:classid/post/:postid/update/:updateid'
					element={<ClassHome />}
				/>
				<Route path='/classhome/:classid/write' element={<ClassHome />} />
				<Route path='/auth' element={<OAuth />} />
			</Routes>
			<Modal />
		</Container>
	);
};

export default App;

const Container = styled.div`
	padding-bottom: 100px;
`