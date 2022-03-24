import styled from 'styled-components';
import LectureChating from './LectureChating';
import LectureReact from './LectureReact';

export default function LectureRoom() {
  return (
    <>
      <Wrap>
        <Container>
          {/* 콘텐츠 */}
          <Group>
            {/* 메인컨텐츠 */}
            <MainCont/>                          
            {/* 서브컨텐츠 */}
            <LectureReact/>
          </Group>
          {/* 채팅 */}
          <LectureChating/>
        </Container>
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  padding-top: 20px;
  display: flex;  
  justify-content: center;

`;
const Container = styled.div`
  width: 80vw;
  height: auto;
  display: flex;
`;
const Group = styled.div`
  width: 70%;
`;
const MainCont = styled.div`
  height: 70%;
  position: relative;
  background-color:gray;
`;
