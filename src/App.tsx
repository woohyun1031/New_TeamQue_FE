import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './components/Welcome';
import ClassHome from './pages/ClassHome';
import ClassRoom from './pages/ClassRoom';
import Main from './pages/Main';

const App = () => {
	return (
		<>
			<Header/>
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/classroom' element={<ClassRoom />} />
				<Route path='/classhome' element={<ClassHome />} />
			</Routes>
		</>
	);
};

export default App;
