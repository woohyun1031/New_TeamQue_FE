import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { socket } from '../../pages/ClassRoom';
import { RootState } from '../../store/configStore';

type stateType = 'connect' | 'disconnect' | 'correct' | 'incorrect' | 'away';

type studentType = {
	userId: number;
	name: string;
	state: stateType;
};

type StateProps = {
	students: studentType[];
	isConnected: boolean;
};

const State = ({ students, isConnected }: StateProps) => {
	const user = useSelector((state: RootState) => state.user);
	const [myState, setMyState] = useState<stateType>('connect');
	const [studentState, setStudentState] = useState<studentType[]>(students);
	const { classid } = useParams();
	const classId = parseInt(classid as string)
	
	useEffect(() => {
		if (isConnected) {
			socket.on('changeState', ({ userId, state }) => {
				setStudentState((prev) =>
					prev.map((student: studentType) =>
						student.userId === userId ? { ...student, state } : student
					)
				);
			});
		}
	}, [isConnected]);

	useEffect(() => {
		setStudentState(students);
	}, [students]);

	const changeMyState = (state: stateType) => {
		if (myState === state) {
			state = 'connect';
		}

		socket.emit('changeMyState', { classId, state }, () => {
			setMyState(state);
		});
	};

	return (
		<StateBox>
			<MyStateBox>
				<UpperBox>
					<MyName>{user.name}</MyName>
					<StateButtons>
						<StateButton
							onClick={() => changeMyState('correct')}
							src='/images/correctbutton.png'
							isActive={myState === 'correct'}
						/>
						<Hr />
						<StateButton
							onClick={() => changeMyState('incorrect')}
							src='/images/incorrectbutton.png'
							isActive={myState === 'incorrect'}
						/>
						<Hr />
						<StateButton
							onClick={() => changeMyState('away')}
							src='/images/awaybutton.png'
							isActive={myState === 'away'}
						/>
					</StateButtons>
				</UpperBox>
				<MyStateCharacter src={`/images/my${myState}.png`} />
			</MyStateBox>
			<StudentStateBox>
				{studentState.map((student: studentType) => {
					if (student.userId !== user.id) {
						return (
							<StudentBox key={student.userId}>
								<StudentName>{student.name}</StudentName>
								<StudentState src={`/images/${student.state}.png`} />
							</StudentBox>
						);
					}
				})}
			</StudentStateBox>
		</StateBox>
	);
};

export default State;

const StateBox = styled.div`
	margin-top: 40px;
	display: flex;
`;

const MyStateBox = styled.div`
	width: 490px;
	height: 300px;
	margin-right: 22px;
`;

const UpperBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const MyName = styled.h2`
	font-size: 24px;
	font-weight: bold;
`;

const MyStateCharacter = styled.div<{ src: string }>`
	background-image: url(${({ src }) => src});
	background-position: left center;
	background-repeat: no-repeat;
	width: 300px;
	height: 300px;
`;

const StateButtons = styled.div`
	width: 276px;
	height: 72px;
	border-radius: 7px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.background};
	
`;

const StateButton = styled.button<{ src: string; isActive: boolean }>`
	background-image: url(${({ isActive, src }) => isActive ? src : `'${src.split('.')[0]}off.png'`});
	${({ theme }) => theme.commons.backgroundImage};
	width: 90px;
	height: 72px;
	transition: .3s;
	&:hover {
		filter: brightness(120%);
	}
	&:active {
		filter: brightness(70%);
	}
`;

const Hr = styled.hr`
	border: none;
	border-radius: 1px;
	width: 2px;
	height: 30px;
	background-color: ${({ theme }) => theme.colors.sub};
`;

const StudentStateBox = styled.div`
	width: 380px;
	height: 300px;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	padding: 20px;
	background-color: ${({ theme }) => theme.colors.background};
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: ${({ theme }) => theme.colors.scrollHover};
	}
`;

const StudentBox = styled.div`
	display: inline-block;
	height: 100px;
	width: 83px;
`;

const StudentName = styled.h4`
	font-size: 12px;
	font-weight: bold;
	text-align: center;
	margin-bottom: 8px;
`;

const StudentState = styled.div<{ src: string }>`
	background-image: url(${({ src }) => src});
	${({ theme }) => theme.commons.backgroundImage}
	width: 50px;
	height: 50px;
	margin: 0 auto;
`;
