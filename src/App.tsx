import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import LectureRoom from './components/LectureRoom';

const App = () => {
	return (
		<>
			<Header/>
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/lecture/:roomName' element={<LectureRoom />} />
			</Routes>
		</>
	);
};

export default App;
