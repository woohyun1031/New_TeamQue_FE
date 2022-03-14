import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ClassHome from './pages/ClassHome';
import Main from './pages/Main';

const App = () => {
	return (
		<>
			<Header/>
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/classhome' element={<ClassHome />} />
			</Routes>
		</>
	);
};

export default App;
