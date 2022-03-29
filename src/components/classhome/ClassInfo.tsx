import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { changeModal, openModal } from '../../store/modules/modal';
import apis from '../../api';

const ClassInfo: React.FC = () => {
	const dispatch = useDispatch();
	const { classid } = useParams();
	const [students, setStudents] = useState<{ name: string }[]>();
	const [data, setData] = useState<{
		title: string;
		teacher: string;
		time: string;
		imageUrl: string;
	}>();
	const fetch = async () => {
		// 로직 다듬기
		if (classid) {
			const response = await apis.loadClassInfo(classid);
			const response2 = await apis.loadStudents(classid);
			setData(response.data);
			setStudents(response2.data);
		}
	};
	useEffect(() => {
		fetch();
	}, []);
	const openInviteCode = () => {
		dispatch(openModal());
		dispatch(changeModal('inviteCode'));
	};
	console.log(students);
	return (
		<Container>
			<Image src={data && data.imageUrl} />
			<Title>{data && data.title}</Title>
			<Teacher>{data && data.teacher} 선생님</Teacher>
			<Time>{data && data.time}</Time>
			<StudentInfo>
				<div>
					<h4>
						수강생 <button onClick={openInviteCode}>+</button>
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
					{students &&
						students.map((student: any, index: number) => (
							<Tr key={index} isAccepted={student.state === 'accepted'}>
								<td>{student.id}</td>
								<td>{student.name}</td>
								<td>
									{student.state === 'accepted' ? (
										<Button>퇴출</Button>
									) : (
										<>
											<AcceptButton>승인</AcceptButton>
											<RejectButton>거부</RejectButton>
										</>
									)}
								</td>
							</Tr>
						))}
				</StudentList>
			</TableBox>
		</Container>
	);
};

export default ClassInfo;

const Container = styled.div`
	/* 사이즈 */
	width: 280px;
	height: 540px;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	/* 임시 스타일 코드 */
	background-color: ${({ theme }) => theme.colors.background};
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	position: relative;
`;

const Image = styled.img`
	width: 230px;
	height: 155px;
	border-radius: 7px;
	object-fit: cover;
`;

const Title = styled.h2`
	font-size: 18px;
	color: ${({ theme }) => theme.colors.title};
`;

const Teacher = styled.p`
	margin-top: 10px;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const Time = styled.p`
	margin-top: 10px;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const StudentInfo = styled.div`
	width: 230px;
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
	width: 240px;
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
	width: 50px;
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