import { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Header from './components/Header';
import Modal from './components/modal/Modal';
import OAuth from './components/OAuth';

// import ClassHome from './pages/ClassHome';
// import ClassRoom from './pages/ClassRoom';
import Main from './pages/Main';

import { closeModal, openModal } from './store/modules/modal';
import { getUserInfo } from './store/modules/user';
import { RootState } from './store/configStore';

import GlobalStyle from './styles/GlobalStyle';

import styled from 'styled-components';

const ClassHome = lazy(() => import('./pages/ClassHome'));
const ClassRoom = lazy(() => import('./pages/ClassRoom'));

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
			dispatch(openModal('notSignIn'));
		}
	}, [isLogin, isToken]);

	return (
		<Container>
			<GlobalStyle />
			<Header />
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path='/' element={<Main />} />
					<Route path='/classroom/:classid' element={<ClassRoom />} />
					<Route path='/classhome/:classid/:page' element={<ClassHome />} />
					<Route path='/classhome/:classid/write' element={<ClassHome />} />
					<Route
						path='/classhome/:classid/post/:postid'
						element={<ClassHome />}
					/>
					<Route
						path='/classhome/:classid/update/:updateid'
						element={<ClassHome />}
					/>
					<Route path='/auth' element={<OAuth />} />
				</Routes>
			</Suspense>
			<Modal />
		</Container>
	);
};

export default App;

const Container = styled.div`
	padding-bottom: 100px;
`;
