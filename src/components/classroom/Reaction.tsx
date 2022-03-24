import { ChangeEvent, useEffect, useState } from 'react';
import styled from "styled-components"
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

type studentType = {
	nickname: string;
	state: number;
};

type checkType = {
	[index: string]: boolean;
	correct: boolean;
	incorrect: boolean;
	question: boolean;
};

type checkEnumType = {
	[index: string]: number;
	disconnect: number;
	connect: number;
	correct: number;
	incorrect: number;
	question: number;
};

function Reaction() {
	const [ischeck, setChecked] = useState<checkType>({
		correct: false,
		incorrect: false,
		question: false,
	});
	const [isConnect, setConnect] = useState(false);
	const [students, setStudents] = useState<studentType[]>();
	const params = useParams();

	const url = 'ws://xpecter.shop';
	const classId = params.classid;

	const accessToken = sessionStorage.getItem('accessToken');

	const checkEnum: checkEnumType = {
		disconnect: 1,
		connect: 2,
		correct: 3,
		incorrect: 4,
		question: 5,
	};

	const mynickname = sessionStorage.getItem("nickname");
	const teacherNickname = '공정용';

	useEffect(() => {
		const fetchData = () => {
			socket = io(url);
			socket.emit('init', { accessToken, nickname: mynickname });

			socket.on('initOk', () => {
				socket.emit(
					'joinRoom',
					{ classId: Number(classId) },
					(payload: { userList: { nickname: string; state: number }[] }) => {
						console.log(payload, 'payload');
						if (students) {
							setStudents(
								Object.values(payload.userList).map((student) =>
									student.nickname === mynickname
										? { nickname: mynickname, state: checkEnum.connect }
										: student
								)
							);
							setConnect(true);
								setTimeout(() => {if (isConnect === true) {
									socket.on('changeState', ({ nickname, state }) => {
										if (students) {
											const newStudents = students.map((student: studentType) =>
												student.nickname === nickname
													? { nickname: student.nickname, state }
													: student
											);
											setStudents(newStudents);
										}
									});
						
									socket.on('joinUser', ({ nickname, state }) => {
										console.log(nickname, state, 'joinUser');
										console.log(students, 'in joinUser');
										if (students) {
											const newStudents = students.map((student: studentType) =>
												student.nickname === nickname
													? { nickname: nickname, state: state }
													: student
											);
											setStudents(newStudents);
										}
									});
								}}, 3000);							
						}
					}
				);
			});
		};

		fetchData();
	}, []);

	// useEffect(() => {
	// 	console.log(isConnect, 'isConnect');
	// 	if (isConnect === true) {
	// 		socket.on('changeState', ({ nickname, state }) => {
	// 			if (students) {
	// 				const newStudents = students.map((student: studentType) =>
	// 					student.nickname === nickname
	// 						? { nickname: student.nickname, state }
	// 						: student
	// 				);
	// 				setStudents(newStudents);
	// 			}
	// 		});

	// 		socket.on('joinUser', ({ nickname, state }) => {
	// 			console.log(nickname, state, 'joinUser');
	// 			console.log(students, 'in joinUser');
	// 			if (students) {
	// 				const newStudents = students.map((student: studentType) =>
	// 					student.nickname === nickname
	// 						? { nickname: nickname, state: state }
	// 						: student
	// 				);
	// 				setStudents(newStudents);
	// 			}
	// 		});
	// 	}
	// 	// return () => {
	// 	// 	socket.current.disconnect();
	// 	// 	setConnect(false);
	// 	// };
	// }, [isConnect]);

	useEffect(() => {
		console.log(students, 'student in useEffect');
	}, [students]);

	useEffect(() => {
		if (
			ischeck.correct === false &&
			ischeck.incorrect === false &&
			ischeck.question === false
		) {
			console.log('all false!!');
			socket.emit(
				'changeMyState',
				{ classId, state: checkEnum.connect },
				() => {
					console.log('callback student');
					if (students) {
						const newStudents = students.map((student: studentType) =>
							student.nickname === mynickname
								? { nickname: student.nickname, state: checkEnum.connect }
								: student
						);
						setStudents(newStudents);
					}
				}
			);
		} else {
			const newCheck = Object.keys(ischeck).find((key) => ischeck[key]);
			if (newCheck) {
				socket.emit(
					'changeMyState',
					{ classId, state: checkEnum[newCheck] },
					() => {
						if (students) {
							const newStudents = students.map((student: studentType) =>
								student.nickname === mynickname
									? { nickname: student.nickname, state: checkEnum[newCheck] }
									: student
							);
							setStudents(newStudents);
						}
					}
				);
			}
		}
	}, [ischeck]);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
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
		console.log(students, 'student,renderStudent');
		if (students) {
			return students.map(({ nickname, state }, index) => (
				<div key={index} className='reacton_container'>
					<div className='reacton_nickname'>
						<p>{nickname}</p>
					</div>
					<div className='reacton_contents'>{state}</div>
				</div>
			));
		}
	};

	const renderTeacher = () => {
		//map을 돌릴 때 선생님과 nickname이 일치하면
		console.log(students, 'teacher');

		const teacher =
			students &&
			students.find((student) => student.nickname === teacherNickname);

		return teacher ? (
			<div className='reacton_container'>
				<div className='reacton_nickname'>
					<p>{teacher.nickname}</p>
				</div>
			</div>
		) : (
			<div className='reacton_container'>
				<div className='reacton_nickname'>
					<p>retry</p>
				</div>
			</div>
		);
	};

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
					<div className='check_image'>render image</div>
				</ReactCont>
				<ShowCont>
					<div className='teacher_react'>
						{/* 선생님렌더될곳 renderTeacher() */}
						{renderTeacher()}
					</div>
					<div className='student_react'>{renderStudent()}</div>
				</ShowCont>
			</Container>
		</>
	);
}
export default Reaction;

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
