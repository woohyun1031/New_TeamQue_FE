import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configStore';

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

const Reaction = () => {
	const user = useSelector((state: RootState) => state.user);
	const [ischeck, setChecked] = useState<checkType>({
		correct: false,
		incorrect: false,
		question: false,
	});
	const [isConnect, setConnect] = useState(false);
	const [students, setStudents] = useState<studentType[]>([]);
	const params = useParams();

	const url = 'ws://noobpro.shop';
	const classId = params.classid;

	const accessToken = sessionStorage.getItem('accessToken');

	const checkEnum: checkEnumType = {
		disconnect: 1,
		connect: 2,
		correct: 3,
		incorrect: 4,
		question: 5,
	};

	const myReaction = [
		'',
		'/images/myConnect.png',
		'/images/myCorrect.png',
		'/images/myIncorrect.png',
		'/images/myQuestion.png',
	];

	const reaction = [
		'/images/disconnect.png',
		'/images/connect.png',
		'/images/correct.png',
		'/images/incorrect.png',
		'/images/question.png',
	];

	const mynickname = sessionStorage.getItem('nickname');
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
						if (students) {
							setStudents(
								Object.values(payload.userList).map((student) =>
									student.nickname === mynickname
										? { nickname: mynickname, state: checkEnum.connect }
										: student
								)
							);
							setConnect(true);
							if (isConnect === true) {
								socket.on('changeState', ({ nickname, state }) => {
									//내가 보냈는데 자꾸 changeState가 들어옴
									console.log('changeState!!');
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
									if (students) {
										const newStudents = students.map((student: studentType) =>
											student.nickname === nickname
												? { nickname: nickname, state: state }
												: student
										);
										setStudents(newStudents);
									}
								});
							}
						}
					}
				);
			});
		};
		fetchData();
	}, [isConnect]);


	useEffect(() => {
		if (
			ischeck.correct === false &&
			ischeck.incorrect === false &&
			ischeck.question === false
		) {
			socket.emit(
				'changeMyState',
				{ classId, state: checkEnum.connect },
				() => {
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
		const { name, checked } = e.target;
		console.log(name, checked, 'before setChecked');
		setChecked({
			correct: false,
			incorrect: false,
			question: false,
			[name]: checked,
		});
	};

	const renderStudent = () => {
		if (students) {
			return students.map(({ nickname, state }, index) => (
				<Student key={index}>
					<StudentNickname>{nickname}</StudentNickname>
					<img src={reaction[state - 1]} />
				</Student>
			));
		}
	};

	const renderTeacher = () => {
		const teacher =
			students &&
			students.find((student) => student.nickname === teacherNickname);

		return teacher ? (
			<TeacherBox className='reacton_container'>
				<p>{teacher.nickname}</p>
				<img src='/images/connect.png' />
			</TeacherBox>
		) : (
			<div className='reacton_container'>
				<div className='reacton_nickname'>
					<p>reroad</p>
				</div>
			</div>
		);
	};

	const renderImage = () => {
		const stateImage =
			students && students.find((student) => student.nickname === mynickname);
		return stateImage ? (
			<div>
				<MyReactionCharacter src={myReaction[stateImage.state - 1]} />
			</div>
		) : (
			<div>
				<p>reroad</p>
			</div>
		);
	};

	return (
		<Container>
			<MyReactionBox>
				<MyNickname>{user.user_info.nickname}</MyNickname>
				<ReactionButtons>
					<ReactionLabel>
						<ReactionInput
							name='correct'
							type='checkbox'
							onChange={onChange}
							checked={ischeck.correct}
						/>
						<ReactionButton src='/images/correct.png' />
					</ReactionLabel>
					<ReactionLabel>
						<ReactionInput
							name='incorrect'
							type='checkbox'
							onChange={onChange}
							checked={ischeck.incorrect}
						/>
						<ReactionButton src='/images/incorrect.png' />
					</ReactionLabel>
					<ReactionLabel>
						<ReactionInput
							name='question'
							type='checkbox'
							onChange={onChange}
							checked={ischeck.question}
						/>
						<ReactionButton src='/images/question.png' />
					</ReactionLabel>
				</ReactionButtons>
				<div className='check_image'>{renderImage()}</div>
			</MyReactionBox>
			<ReactionBox>
				<TeacherBox>{renderTeacher()}</TeacherBox>
				<StudentBox>{renderStudent()}</StudentBox>
			</ReactionBox>
		</Container>
	);
};
export default Reaction;

const Container = styled.div`
	width: 890px;
	height: 300px;
	display: flex;
	justify-content: space-between;
	position: relative;
`;

const MyReactionBox = styled.div`
	width: 500px;
	position: relative;
`;

const MyNickname = styled.h2`
	padding: 30px;
	font-size: ${({ theme }) => theme.fontSizes.xxlg};
	font-weight: 700;
`;

const ReactionButtons = styled.div`
	width: 260px;
	position: absolute;
	right: 20px;
	top: 0;
	display: flex;
	justify-content: space-between;
`;

const MyReactionCharacter = styled.img`
	position: absolute;
	bottom: -20px;
	left: 0px;
`;

const ReactionBox = styled.div`
	width: 380px;
	height: 300px;
	border-radius: 10px;
	background-color: #fff;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;

const ReactionLabel = styled.label`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70px;
	height: 70px;
	border-radius: 7px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;

const ReactionInput = styled.input`
	display: none;
`;

const ReactionButton = styled.img`
	flex: 0;
`;

const TeacherBox = styled.div`
	height: 100px;
	padding-top: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 12px;
`;

const StudentBox = styled.div`
	height: 200px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-wrap: wrap;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ccc;
		border-radius: 10px;
	}
`;

const Student = styled.div`
	height: 75px;
	font-weight: 700;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const StudentNickname = styled.h4`
	font-size: 12px;
`;
