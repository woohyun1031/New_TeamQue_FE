import { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

function LectureReact() {
  const [check, setChecked] = useState({
    checkCorrect:'',   
    checkNo:'', 
    checkQuestion:'',
  }); 
  const [teacherReact, setTeacher] = useState({
    reaction:'',   
  }); 
  const [studentReact, setStudent] = useState({}); 
  //{학생 이름:학생 이름, 학생 접속여부:bool,학생 반응:string}
  //{단일key : {키:밸류, 키:밸류}}
  //[학생이름:{학생 접속여부:bool,학생 반응:string}, 학생이름:{학생 접속여부:bool,학생 반응:string}...]
  const url = "ws://xpecter.shop";
  const params = useParams(); 
  const socket = useRef();  
  const roomName = params.roomName;

  const accessToken = sessionStorage.getItem("accessToken");
  
  let mynickname = "woohyun";
  //let nickname = sessionStorage.getItem("nickname");

   useEffect(() => {
    socket.current = io(url);
    socket.current.emit("init",{accessToken,nickname:mynickname});
    
    socket.current.on("initOk",()=>{
      socket.current.emit("joinRoom", {roomName});
    });//소켓 연결, initok 이후

    //선생님 반응 받아서 받아온 선생님의 state를 업데이트시켜 실시간 렌더    
    // socket.current.on("선생님 반응 실시간 렌더",({"받을 인자"})=>{         
    //   const newReaction = [...teacherReact, {"받을 데이터"} ] 
    //   setTeacher(newReaction);});
    socket.current.on("reactionTeacher",({reaction})=>{         
      const newReaction = [...teacherReact, {"김선생": reaction} ] 
      setTeacher(newReaction);});

    //바뀐 학생의 반응 받아서 받아온 학생의 정보를 state를 업데이트,추가시켜 실시간 렌더 
    //기존 학생 배열에서 특정 값을 찾아 교체,바꿔야되는데   
    //후보 1.
    // socket.current.on("학생들 반응 받아서 실시간 렌더",({"받을 인자"})=>{// 학생이름key:{학생이름:받은데이터,학생접속여부:받은데이터,학생반응:string}   
    //   const newReaction = [...studentReact, {"받을 데이터"} ] //{학생고유id:학생고유id :{학생 이름:학생 이름, 학생 접속여부:bool,학생 반응:string}}
    //   //어떻게 교체해야될까
    //   setStudent(newReaction);});
    // },[]);
    
    //후보 2.
    socket.current.on("reaction’",({nickname,reaction})=>{         
      const newReact = {...studentReact, [nickname]:{reaction,}}
      setStudent(newReact);})
    });

  const onChange = (e) => { //name에는 내 nickname 넣어주기
    const {name, checked} = e.target
    setChecked({
      ...check, 
      [name]:checked,
    })
    //보낼 때
   // socket.current.emit("내 데이터 보냅니다","보낼값들 => 내 이름, 접속 여부, 현재반응",()=>{"내 반응 추가!! setStudent(내 반응 추가)"})
  }
  
  return (
    <>
      <Container>
        <ReactCont>        
          <p className="header_modal_title">이름들어갈곳</p> 
          <label>
            <input 
              className="header_modal_checkbox" 
              name='checkCorrect' 
              type="checkbox" 
              onChange={onChange}
            />
            O
          </label>
          <label>
            <input 
              className="header_modal_checkbox" 
              name='checkNo' 
              type="checkbox" 
              onChange={onChange}
            />
            X
          </label>
          <label>
            <input 
              className="header_modal_checkbox" 
              name='checkQuestion' 
              type="checkbox" 
              onChange={onChange}
            />
            ?
          </label>
          <div className="check_image">
            여기에 사진이 변경되며 들어간다
          </div>        
        </ReactCont>
        <ShowCont>
          <div className="teacher_react">
            선생님렌더될곳
          </div>
          <div className="student_react">
            학생렌더될곳
          </div>
        </ShowCont>                
      </Container>
    </>
  );
}

export default LectureReact;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 30%;
  background-color:pink;
  display:flex;
`;
const ReactCont = styled.div`
  width:50%;
  margin:10px;
  background-color:red;
  .check_image{
    width:100px;
    height:auto;
    background-color:white;    
  }
`;
const ShowCont = styled.div`
  width:50%;
  margin:10px;
  background-color:blue;
  display:flex;
  flex-direction:column;
  align-items:center;
  .teacher_react{
    text-align:center;
    width:100%;
    height:30%;
    background-color:white; 
  }
  .student_react{
    text-align:center;
    width:100%;
    height:70%;
    background-color:gray; 
  }
`;