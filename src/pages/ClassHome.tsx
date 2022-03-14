import styled from 'styled-components';

const ClassHome = () => {
	return (
		<Container>
			<ClassInfo>
				<h1>강의 프로필</h1>
				<h1>학생목록</h1>
				<h1>수업일정</h1>
			</ClassInfo>
    <Forum>
      <h1>게시판</h1>
    </Forum>
		</Container>
	);
};

export default ClassHome;

const Container = styled.div`
	display: flex;
`;

const ClassInfo = styled.div``;

const Forum = styled.div``;
