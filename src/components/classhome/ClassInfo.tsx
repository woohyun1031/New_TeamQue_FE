import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { adddata, changeModal, openModal } from '../../store/modules/modal';
import api from '../../api';
import { RootState } from '../../store/configStore';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const ClassInfo = () => {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { classid } = useParams();
	const { id } = useSelector((state: RootState) => state.user);

	const { data: classInfo } = useQuery('classInfo', () =>
		api.loadClassData(classid as string)
	);
	const { data: students } = useQuery('students', () =>
		api.loadStudents(classid as string)
	);

	const openInviteCode = () => {
		if (classInfo) {
			dispatch(adddata(classInfo?.uuid));
			dispatch(openModal());
			dispatch(changeModal('inviteCode'));
		}
	};

	const { mutate: acceptStudent } = useMutation(
		(studentId: number) => api.changeState(classid as string, studentId, true),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('students');
			},
		}
	);

	const { mutate: rejectStudent } = useMutation((studentId: number) =>
		api.changeState(classid as string, studentId, false)
	);

	const handleClickReject = (studentsId: number) => {
		if (confirm('정말로 거부하겠습니까?')) {
			rejectStudent(studentsId)
		}
	}

	const toClassRoom = () => {
		navigate(`/classroom/${classid}`);
	};

	const exitClass = async () => {
		if (confirm('정말로 수업을 나가시겠습니까?')) {
			if (classid) {
				await api.cancelApply(classid);
				navigate('/');
			}
		}
	};

	return (
		<Container>
			<ClassRoomButton onClick={toClassRoom} />
			<Image src={classInfo?.imageUrl} />
			<ThumbnailFilter onClick={toClassRoom} />
			<Title>{classInfo?.title}</Title>
			<Teacher>{classInfo?.teacher} 선생님</Teacher>
			<Time>
				{classInfo?.timeTable?.map((time: string, index: number) => (
					<DayNum key={index}>{time}</DayNum>
				))}
			</Time>
			<StudentInfo>
				<div>
					<h4>
						수강생
						{classInfo?.isByMe && <button onClick={openInviteCode}>+</button>}
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
						{classInfo?.isByMe
							? students?.map((student) => (
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
														onClick={() => handleClickReject(student.userId)}
													>
														거부
													</RejectButton>
												</>
											)}
										</td>
									</Tr>
							  ))
							: students?.map((student) =>
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

const ThumbnailFilter = styled.button`
	background-image: url('/images/play.png');
	${({ theme }) => theme.commons.backgroundImage};
	width: 230px;
	height: 155px;
	border-radius: 7px;
	top: 20px;
	position: absolute;
	opacity: 0;
	z-index: 10;
	transition: 0.5s;
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
const Time = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	flex-wrap: wrap;
	margin: 10px;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const DayNum = styled.li`
	width: 120px;
	height: 22px;
	padding: 1px;
	border-radius: 10px;
	margin: 2px 0px;
	text-align: center;
	align-items: center;
	font-size: 12px;
	background-color: ${({ theme }) => theme.colors.base};
	color: ${({ theme }) => theme.colors.title};
`;

const StudentInfo = styled.div`
	width: 235px;
	display: flex;
	justify-content: space-between;
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
	& button {
		font-size: 18px;
		font-weight: bold;
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
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: ${({ theme }) => theme.colors.reject};
	background-color: ${({ theme }) => theme.colors.base};
	margin-bottom: 2px;
	& + & {
		margin-left: 4px;
	}
`;

const RejectButton = styled(Button)`
	color: ${({ theme }) => theme.colors.main};
`;

const AcceptButton = styled(Button)`
	color: ${({ theme }) => theme.colors.background};
	${({ theme }) => theme.commons.mainButton};
`;

const Tr = styled.tr<{ isAccepted: boolean }>`
	${({ isAccepted }) => !isAccepted && 'color: #718AFF;'}
`;

const ClassRoomButton = styled.button`
	background-image: url('/images/toclassroom.png');
	${({ theme }) => theme.commons.backgroundImage};
	width: 143.41px;
	height: 66px;
	position: absolute;
	top: -66px;
	right: -20px;
	z-index: 0;
`;
