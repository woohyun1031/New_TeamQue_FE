import styled from 'styled-components';

import LectureChating from './LectureChating';

export default function LectureRoom() {
  return (
    <>
      <Wrap>
        <Container>
          {/* 콘텐츠 */}
          <GroupCont>
            {/* 메인컨텐츠 */}
            <MainCont>              
            </MainCont>
            {/* 서브컨텐츠 */}
            <SubCont>
            </SubCont>
          </GroupCont>
          {/* 채팅 */}
          <LectureChating openChat={"test"} />
        </Container>
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  padding-top: 50px;
  display: flex;  
`;
const Container = styled.div`
  width: 100vw;
  height: auto;
  display: flex;
`;
const GroupCont = styled.div`
  width: 70%;
`;
const MainCont = styled.div`
  height: 70%;
  position: relative;
  background-color:gray;
`;
const SubCont = styled.div`
  height: 30%;
  position: relative;
  background-color:black;  
`;