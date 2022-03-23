 import { useEffect, useRef, useState, useCallback } from "react";
 import styled from "styled-components";
 import { useParams } from "react-router-dom";
 import io from "socket.io-client";
 function LectureReact() {
   const [ischeck, setChecked] = useState({
     checkCorrect:false,
     checkNo:false,
     checkQuestion:false
   }); 
   const [studentReact, setStudent] = useState([]); 
   const url = "ws://xpecter.shop";
   const params = useParams(); 
   const socket = useRef();  
   const roomName = params.roomName;
   const [isConnect, setConnect] = useState(false);
   const accessToken = sessionStorage.getItem("accessToken");

   let mynickname = "woohyun";
   let teacherNickname = "금수강산"
   useEffect(() => {
       if(isConnect === false){
         socket.current = io(url);
         socket.current.emit("init",{accessToken,nickname:mynickname});
       }
       socket.current.on("initOk",()=>{
         socket.current.emit("joinRoom", {roomName},(userList)=>{          
           setStudent(userList); //초기 세팅한번만 동작하게
         });
       });
       setConnect(true); 
                 
     return () => {                   
       socket.current.disconnect();
       setConnect(false); 
     };      
   },[]);
   useEffect(() => {
     
    socket.current.on("joinUser",({nickname,state})=>{    
      setStudent({...studentReact, [nickname]:state});
    })
 
    socket.current.on("changeState",({nickname,state})=>{         
      const newReact = studentReact.map((student)=> student.nickname === nickname ? {...student, state:state} : student)
      setStudent(newReact);
    })          
  return () => {                
    socket.current.disconnect();
    setConnect(false);
  };      
},[studentReact]);
   const onChange = (e) => { //name에는 내 nickname 넣어주기    
     const {name, checked} = e.target
     setChecked({checkCorrect:false,checkNo:false,checkQuestion:false,[name]:checked})
     socket.current.emit("changeMyState",{roomName,state:name},()=>{ //name명 통일
       studentReact({...studentReact, [mynickname]:name});
     })
   }
   const renderStudent = () => {     
    // return studentReact.map(({nickname,state},index) =>         
    // nickname === teacherNickname ? null :
    // (<>                      
    //     <div key={index} className="reacton_container">           
    //       <div className="reacton_nickname">
    //         <p>{nickname}</p>
    //       </div>        
    //       <div className="reacton_contents">
    //         {/* 추후 public 폴더에 저장된 이미지를 reaction 값에 맞게 불러와 사용 */}
    //         {state}
    //       </div>
    //     </div>
    //   </>        
    // ));    
      return (
        <>                      
          <StateContainer>           
            <div className="reacton_contents">
              {/* 추후 public 폴더에 저장된 이미지를 reaction 값에 맞게 불러와 사용 */}
              image
            </div>
            <div className="reacton_nickname">
              김xx
            </div>        
          </StateContainer>

          <StateContainer>           
            <div className="reacton_contents">
              {/* 추후 public 폴더에 저장된 이미지를 reaction 값에 맞게 불러와 사용 */}
              image
            </div>
            <div className="reacton_nickname">
              박xx
            </div>        
          </StateContainer>          
        </>        
      ); 
    }
    let studentRender = renderStudent();

   const renderTeacher = () => {   
     //map을 돌릴 때 선생님과 nickname이 일치하면 
     const {nickname,state} = studentReact.find((student) => student.nickname === teacherNickname)                    
     return (       
       <StateContainer>      
         <h3>슨생님</h3>     
         <div className="state_nickname">
           <p>{nickname}</p>
         </div>        
         <div className="state_contents">
           {/* 추후 public 폴더에 저장된 이미지를 reaction 값에 맞게 불러와 사용 */}
           {state}
         </div>
       </StateContainer>
     )
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
               checked={ischeck.checkCorrect}
             />
             O
           </label>
           <label>
             <input 
               className="header_modal_checkbox" 
               name='checkNo' 
               type="checkbox" 
               onChange={onChange}
               checked={ischeck.checkNo}
             />
             X
           </label>
           <label>
             <input 
               className="header_modal_checkbox" 
               name='checkQuestion' 
               type="checkbox" 
               onChange={onChange}
               checked={ischeck.checkQuestion}
             />
             ?
           </label>
           <div className="check_image">
             {()=>{"ischeck"}}
           </div>        
         </ReactCont>
         <ShowCont>
           <div className="teacher_react">
             {/* 선생님렌더될곳 renderTeacher() */}
             teacherReact()
           </div>
           <div className="student_react">             
             {studentRender}
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
     display:flex;
     width:100%;
     height:70%;
     background-color:gray; 
   }
 `;
 const StateContainer = styled.div`
    width: 40px;
    height:40px;
    margin: 10px;   
    .reacton_contents{
      width:50px;
      height:50px;
      background-color:white; 
    } 
 `;