import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { adddata, changeModal, openModal } from '../../store/modules/modal';
import apis from '../../api';
import { RootState } from '../../store/configStore';

type ClassDataType = {
	title: string;
	teacher: string;
	timeTable: string[];
	imageUrl: string;
	isByMe: boolean;
	uuid: string;
};

type StudentDataType = {
	userId: number;
	name: string;
	state: 'accepted' | 'wait';
};

const ClassInfo: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { classid } = useParams();
	const [students, setStudents] = useState<StudentDataType[]>();
	const [classData, setClassData] = useState<ClassDataType>();
	const { id, name } = useSelector((state: RootState) => state.user);

	const loadClassInfo = async () => {
		if (classid) {
			const response = await apis.loadClassData(classid);
			const response2 = await apis.loadStudents(classid);
			setClassData(response.data);
			if (classData?.isByMe) {
				setClassData(response2.data);
			} else {
				setStudents([
					{ state: 'accepted', userId: id, name },
					...response2.data.filter(
						(student: StudentDataType) => student.userId !== id
					),
				]);
			}
		}
	};

	useEffect(() => {
		loadClassInfo();
	}, []);

	const openInviteCode = () => {
		if (classData) {
			dispatch(adddata(classData?.uuid));
			dispatch(openModal());
			dispatch(changeModal('inviteCode'));
		}
	};

	const acceptStudent = async (studentId: number) => {
		if (classid) {
			await apis.changeState(classid, studentId, true);
			const { data } = await apis.loadStudents(classid);
			setStudents(data);
		}
	};

	const rejectStudent = async (studentId: number) => {
		if (classid) {
			if (confirm('정말로 퇴출 하실건가요?')) {
				await apis.changeState(classid, studentId, false);
				const { data } = await apis.loadStudents(classid);
				setStudents(data);
			}
		}
	};

	const toClassRoom = () => {
		navigate(`/classroom/${classid}`);
	};

	const exitClass = async () => {
		if (confirm('정말로 수업을 나가시겠습니까?')) {
			if (classid) {
				await apis.cancelApply(classid);
				navigate('/')
			}
		}
	};

	return (
		<Container>
			<ClassRoomButton onClick={toClassRoom} />
			<Image src={classData && classData.imageUrl} />
			<ThumbnailFilter onClick={toClassRoom} />
			<Title>{classData && classData.title}</Title>
			<Teacher>{classData && classData.teacher} 선생님</Teacher>
			<Time>{classData && classData.timeTable[0]}</Time>
			<StudentInfo>
				<div>
					<h4>
						수강생{' '}
						{classData?.isByMe && <button onClick={openInviteCode}>+</button>}
					</h4>
				</div>
				<p>{students && students.length}명</p>
			</StudentInfo>
			<TableBox>
				<StudentList>
					<colgroup>
						<IdColumn span={1} />
						<NameColumn span={1} />
						<col span={1} />
					</colgroup>
					<tbody>
						{classData?.isByMe
							? students?.map((student: StudentDataType) => (
									<Tr
										key={student.userId}
										isAccepted={student.state === 'accepted'}
									>
										<td>{student.userId}</td>
										<td>{student.name}</td>
										<td>
											{student.state === 'accepted' ? (
												<Button onClick={() => rejectStudent(student.userId)}>
													퇴출
												</Button>
											) : (
												<>
													<AcceptButton
														onClick={() => acceptStudent(student.userId)}
													>
														승인
													</AcceptButton>
													<RejectButton
														onClick={() => rejectStudent(student.userId)}
													>
														거부
													</RejectButton>
												</>
											)}
										</td>
									</Tr>
							  ))
							: students?.map((student: StudentDataType) =>
									student.userId !== id ? (
										<Tr key={student.userId} isAccepted={true}>
											<td>{student.userId}</td>
											<td>{student.name}</td>
											<td />
										</Tr>
									) : (
										<Tr key={student.userId} isAccepted={true}>
											<td>{student.userId}</td>
											<td>{student.name}</td>
											<td>
												<Button onClick={exitClass}>나가기</Button>
											</td>
										</Tr>
									)
							  )}
					</tbody>
				</StudentList>
			</TableBox>
		</Container>
	);
};

export default ClassInfo;

const Container = styled.div`
	width: 280px;
	height: 540px;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	background-color: ${({ theme }) => theme.colors.background};
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
`;

const Image = styled.img`
	margin-top: 20px;
	width: 230px;
	height: 155px;
	border-radius: 7px;
	object-fit: cover;
`;

const ThumbnailFilter = styled.div`
	background-image: url('/images/play.png');
	background-repeat: no-repeat;
	background-position: center center;
	width: 230px;
	height: 155px;
	border-radius: 7px;
	top: 20px;
	position: absolute;
	opacity: 0;
	z-index: 10;
	transition: 0.5s;
	cursor: pointer;
	&:hover {
		opacity: 1;
	}
	background-color: rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
	margin-top: 8px;
	font-size: 18px;
	color: ${({ theme }) => theme.colors.title};
`;

const Teacher = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const Time = styled.p`
	margin-bottom: 20px;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const StudentInfo = styled.div`
	width: 235px;
	display: flex;
	justify-content: space-between;
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
	& button {
		border: none;
		background: none;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
	}
`;

const TableBox = styled.div`
	width: 250px;
	height: 220px;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
`;

const StudentList = styled.table`
	width: 235px;
	max-height: 180px;
	margin: 0 auto;
	border-collapse: collapse;
	& tr {
		height: 10px;
		& td {
			padding: 2px;
		}
		& td:last-child {
			text-align: right;
		}
	}
`;

const IdColumn = styled.col`
	width: 40px;
`;

const NameColumn = styled.col`
	width: 100px;
`;

const Button = styled.button`
	width: 37px;
	height: 16px;
	border-radius: 3px;
	font-size: 10px;
	border: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: ${({ theme }) => theme.colors.reject};
	background-color: ${({ theme }) => theme.colors.base};
	margin-bottom: 2px;
	& + & {
		margin-left: 4px;
	}
	cursor: pointer;
`;

const RejectButton = styled(Button)`
	color: ${({ theme }) => theme.colors.main};
`;

const AcceptButton = styled(Button)`
	color: ${({ theme }) => theme.colors.background};
	background-color: ${({ theme }) => theme.colors.main};
`;

const Tr = styled.tr<{ isAccepted: boolean }>`
	${({ isAccepted }) => !isAccepted && 'color: #718AFF;'}
`;

const ClassRoomButton = styled.button`
	background: none;
	border: none;
	background-image: url('/images/toclassroom.png');
	background-position: center center;
	background-repeat: no-repeat;
	width: 143.41px;
	height: 66px;
	position: absolute;
	top: -66px;
	right: -20px;
	z-index: 0;
	cursor: pointer;
	`;