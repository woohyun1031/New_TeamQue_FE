import { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

function LectureReact() {
	const [ischeck, setChecked] = useState({
		correct: false,
		incorrect: false,
		question: false,
	});
	const [isConnect, setConnect] = useState(false);
	const [studentReact, setStudent] = useState([]);
	const url = 'ws://xpecter.shop';
	const params = useParams();
	const socket = useRef();
	const classId = params.classId;
	//const [isConnect, setConnect] = useState(false);
	const accessToken = sessionStorage.getItem('accessToken');
	const checkEnum = {
		disconnect: 1,
		connect: 2,
		correct: 3,
		incorrect: 4,
		question: 5,
	};

	let mynickname = '김우현';
	let teacherNickname = '금수강산';

	useEffect(() => {
		const fetchData = () => {
			socket.current = io(url);
			socket.current.emit('init', { accessToken, nickname: mynickname });

			socket.current.on('initOk', () => {
				socket.current.emit(
					'joinRoom',
					{ classId: Number(classId) },
					(payload) => {
						console.log(payload, 'payload');
						setStudent(
							Object.values(payload.userList).map((student) =>
								student.nickname === mynickname
									? { nickname: mynickname, state: checkEnum.connect }
									: student
							)
						);
						setConnect(true);
					}
				);
			});
		};

		fetchData();
	}, []);

	useEffect(() => {
		console.log(isConnect, 'isConnect');
		if (isConnect === true) {
			socket.current.on('changeState', ({ nickname, state }) => {
				setStudent(
					studentReact.map((student) =>
						student.nickname === nickname
							? { nickname: student.nickname, state }
							: student
					)
				);
			});

			socket.current.on('joinUser', ({ nickname, state }) => {
				console.log(nickname, state, 'joinUser');
				console.log(studentReact, 'in joinUser');
				setStudent(
					studentReact.map((student) =>
						student.nickname === nickname
							? { nickname: nickname, state: state }
							: student
					)
				);
			});
		}
		// return () => {
		// 	socket.current.disconnect();
		// 	setConnect(false);
		// };
	}, [isConnect]);

	useEffect(() => {
		console.log(studentReact, 'studentReact in useEffect');
	}, [studentReact]);

	useEffect(() => {
		if (
			ischeck.correct === false &&
			ischeck.incorrect === false &&
			ischeck.question === false
		) {
			console.log('all false!!');
			socket.current.emit(
				'changeMyState',
				{ classId, state: checkEnum.connect },
				() => {
					console.log('callback studentReact');
					setStudent(
						studentReact.map((student) =>
							student.nickname === mynickname
								? { nickname: student.nickname, state: checkEnum.connect }
								: student
						)
					);
				}
			);
		} else {
			console.log('change!!');
			const newCheck = Object.keys(ischeck).find(
				(key) => ischeck[key] === true
			);
			console.log(checkEnum[newCheck], 'newChecknewCheck');
			socket.current.emit(
				'changeMyState',
				{ classId, state: checkEnum[newCheck] },
				() => {
					console.log('callback studentReact');
					setStudent(
						studentReact.map((student) =>
							student.nickname === mynickname
								? { nickname: student.nickname, state: checkEnum[newCheck] }
								: student
						)
					);
				}
			);
		}
	}, [ischeck]);

	const onChange = (e) => {
		//name에는 내 nickname 넣어주기
		console.log('onChange');
		console.log(ischeck, 'ischeck');
		const { name, checked } = e.target;
		setChecked({
			correct: false,
			incorrect: false,
			question: false,
			[name]: checked,
		});
	};

	const renderStudent = () => {
		console.log(studentReact, 'studentReact,renderStudent');
		return studentReact.map(({ nickname, state }, index) => (
			<div key={index} className='reacton_container'>
				<div className='reacton_nickname'>
					<p>{nickname}</p>
				</div>
				<div className='reacton_contents'>{state}</div>
			</div>
		));
	};

	// const renderTeacher = () => {
	//  //map을 돌릴 때 선생님과 nickname이 일치하면
	//  const {nickname,state} = studentReact.find((student) => student.nickname === teacherNickname)
	//  return (
	//    <StateContainer>
	//      <h3>슨생님</h3>
	//      <div className="state_nickname">
	//        <p>{nickname}</p>
	//      </div>
	//      <div className="state_contents">
	//        {/* 추후 public 폴더에 저장된 이미지를 reaction 값에 맞게 불러와 사용 */}
	//        {state}
	//      </div>
	//    </StateContainer>
	//  )
	// }

	//let studentRender = renderStudent();

	return (
		<>
			<Container>
				<ReactCont>
					<p className='header_modal_title'>이름들어갈곳</p>
					<label>
						<input
							className='header_modal_checkbox'
							name='correct'
							type='checkbox'
							onChange={onChange}
							checked={ischeck.correct}
						/>
						O
					</label>
					<label>
						<input
							className='header_modal_checkbox'
							name='incorrect'
							type='checkbox'
							onChange={onChange}
							checked={ischeck.incorrect}
						/>
						X
					</label>
					<label>
						<input
							className='header_modal_checkbox'
							name='question'
							type='checkbox'
							onChange={onChange}
							checked={ischeck.question}
						/>
						?
					</label>
					<div className='check_image'>image</div>
				</ReactCont>
				<ShowCont>
					<div className='teacher_react'>
						{/* 선생님렌더될곳 renderTeacher() */}
						teacherReact
					</div>
					<div className='student_react'>{renderStudent()}</div>
				</ShowCont>
			</Container>
		</>
	);
}
export default LectureReact;
const Container = styled.div`
	position: relative;
	width: 100%;
	height: 30%;
	background-color: pink;
	display: flex;
`;
const ReactCont = styled.div`
	width: 50%;
	margin: 10px;
	background-color: red;
	.check_image {
		width: 100px;
		height: auto;
		background-color: white;
	}
`;
const ShowCont = styled.div`
	width: 50%;
	margin: 10px;
	background-color: blue;
	display: flex;
	flex-direction: column;
	align-items: center;
	.teacher_react {
		text-align: center;
		width: 100%;
		height: 30%;
		background-color: white;
	}
	.student_react {
		display: flex;
		width: 100%;
		height: 70%;
		background-color: gray;
	}
`;
const StateContainer = styled.div`
	width: 40px;
	height: 40px;
	margin: 10px;
	.reacton_contents {
		width: 50px;
		height: 50px;
		background-color: white;
	}
`;
