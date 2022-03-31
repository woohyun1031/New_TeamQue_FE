import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { adddata, changeModal, openModal } from '../../store/modules/modal';
import apis from '../../api';

const ClassInfo: React.FC = () => {
	const dispatch = useDispatch();
	const { classid } = useParams();
	const [students, setStudents] = useState<{ name: string }[]>();
	const [data, setData] = useState<{
		title: string;
		teacher: string;
		timeTable: string[];
		imageUrl: string;
		isByMe: boolean;
		uuid: string;
	}>();
	const fetch = async () => {
		if (classid) {
			const response = await apis.loadClassInfo(classid);
			const response2 = await apis.loadStudents(classid);
			setData(response.data);
			setStudents(response2.data);
			console.log(response)
		}
	};
	useEffect(() => {
		fetch();
	}, []);
	const openInviteCode = () => {
		if (data) {
			dispatch(adddata(data?.uuid))
		}
		dispatch(openModal());
		dispatch(changeModal('inviteCode'));
	};

	const acceptStudent = async (studentId: string) => {
		if (classid) {
			const response = await apis.changeState(classid, studentId, true);
			const response2 = await apis.loadStudents(classid);
			setStudents(response2.data);

		}
	};

	const rejectStudent = async (studentId: string) => {
		if (classid) {
			if (confirm('정말로 퇴출 하실건가요?')) {
				const response = await apis.changeState(classid, studentId, false);
				const response2 = await apis.loadStudents(classid);
				setStudents(response2.data);
			}
		}
	};

	return (
		<Container>
			<Image src={data && data.imageUrl} />
			<ThumbnailFilter />
			<Title>{data && data.title}</Title>
			<Teacher>{data && data.teacher} 선생님</Teacher>
			<Time>{data && data.timeTable[0]}</Time>
			<StudentInfo>
				<div>
					<h4>
						수강생 {data?.isByMe && <button onClick={openInviteCode}>+</button>}
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
						{data?.isByMe
							? students?.map((student: any, index: number) => (
									<Tr key={index} isAccepted={student.state === 'accepted'}>
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
							: students?.map((student: any, index: number) => {
									if (student.state === 'accepted') {
										return (
											<Tr key={index} isAccepted={true}>
												<td>{student.userId}</td>
												<td>{student.name}</td>
												<td />
											</Tr>
										);
									}
							  })}
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
