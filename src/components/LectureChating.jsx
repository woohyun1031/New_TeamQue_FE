import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

function LectureChating({openChat}) {
  const [chatMessage, setChatMessage] = useState(""); //input message

  const [chats, setChat] = useState([]); //chat 내용 모음

  const [check, setChecked] = useState({
    commonCheck:'',   
    questionCheck:'', 
  }); 
  const [chatcheck, setChatChecked] = useState({
    queCheck:'',       
  });

  const {commonCheck, questionCheck} = check;
  const {queCheck} = chatcheck;
  //chat 내용 모음
  const params = useParams(); //room id 값
  const socket = useRef(); // {current: null};
  //const socket = useRef(); // {current: null};
  
  
  const url = "ws://xpecter.shop"; //socket url
  
  const roomName = params.roomName; //url 뒤에 있는 room id

  //let nickname = sessionStorage.getItem("nickname"); //locat에서 userid 가져옴
  //locat에 nickname, statusmsg, id 값이 있다
  let mynickname = "woohyun";


  //강의실 접속시 발생 1. 소켓 연결 => joinroom =>
  useEffect(() => {
    socket.current = io(url); //소켓 연결 {current: io(url)}   
    socket.current.emit("init",{nickname:mynickname});
    socket.current.on("initOk",()=>{
      socket.current.emit("joinRoom", {roomName}); //서버로 보내는 과정 joinroom    
      console.log("initok!!")
    });
    
    socket.current.on("receiveChatMessage",({nickname,chatMessage})=>{
      console.log(nickname,chatMessage,"useEffect");  
      console.log(chats,"useEffect chats");   
      const newChat =[...chats, {nickname:nickname, chatMessage, check : "common"} ] 
      console.log(newChat,"newChat");     
      setChat(newChat);
      console.log(chats,"입니다입니다");
    })

    socket.current.on("receiveQuestionMessage",({nickname,chatMessage})=>{
      console.log(nickname,chatMessage,"useEffect 여기는 question")
      setChat([...chats, { nickname, chatMessage, check : "question"  }]);
      console.log(chats);
    })
    return () => {
      console.log("disconnect")
      socket.current.disconnect();
    };
  },[chats]); //chat값의 변경할 때 마다 useeffect 동작

  const sendChat = () => {
    console.log("sendcheat!!");
    if (chatMessage !== "") { //chatMessage가 공백이 아니면 => emit sendChatMessage nickname, message, roomid
      if(queCheck === true){
        console.log(chatMessage," 질문일경우 chatMessage");
        socket.current.emit("sendQuestionMessage", {chatMessage, roomName},(message)=>{
          console.log(message,"sendChat")      
          setChat([...chats, { nickname:mynickname, chatMessage:message, check : "question" }]);
          console.log(chats);
        });
        setChatMessage(""); //input 비워준다

      }else{
        console.log(chatMessage,"질문이 아닐경우chatMessage");
        socket.current.emit("sendChatMessage", {chatMessage, roomName},(message)=>{
          console.log(message,"sendChat")      
          setChat([...chats, { nickname:mynickname, chatMessage:message, check : "common" }]);
          console.log(chats,message,"보내고 다시 받는 콜백함수에 다 적혀있어야함");
        });
        setChatMessage(""); //input 비워준다
      }
    }
  };

  const sendMessage = (e) => { //input message => chatMessage 값 변겨
    setChatMessage(e.target.value);
    console.log(chatMessage,"chatMessage");
  };
  const onChange = (e) => {
    const {name, checked} = e.target
    setChecked({
      ...check, 
      [name]:checked,
    })
    console.log(check,"onchange Checked");
  }

  const onChat = (e) => {
    const {name, checked} = e.target
    setChatChecked({
      ...chatcheck,
      [name]:checked,
    })
    console.log(chatcheck,"chatcheck입니다")
  }
  
  const renderChat = () => { //닉네임 + 내용
    if(commonCheck === true){
      console.log(chats,"render1")
      return chats.filter(chat => chat.check === "common").map(({ nickname,chatMessage }, index) =>(
        <div key={index} className={mynickname === nickname ? "chat_from_me" : "chat_from_friend"}> 
          {/* user nickname */}
          {mynickname !== nickname ? <div className="chat_nick">{nickname}</div> : "null"}        
          {/* message */}
          <div className="chat_content">
            <div className="chat_message">{chatMessage}</div>
          </div>
        </div>
      ))
    } else if(questionCheck === true) {
      console.log(chats,"render2")
      return chats.filter(chat => chat.check === "question").map(({ nickname, chatMessage }, index) =>(
        <div key={index} className={mynickname === nickname ? "chat_from_me" : "chat_from_friend"}> 
          {/* user nickname */}
          {mynickname !== nickname ? <div className="chat_nick">{nickname}</div> : null}        
          {/* message */}
          <div className="chat_content">
            <div className="chat_message">{chatMessage}</div>
          </div>
        </div>
      ))
    } 
    
    else {
      console.log(chats,"render3")
      const temp = chats.map(({ nickname,chatMessage }, index) => (      
        //session storage에서 가져온 nickname과 user값이 같으면(내가 쓴 챗) chat from me
        <div key={index} className={mynickname === nickname ? "chat_from_me" : "chat_from_friend"}> 
          {/* user nickname */}
          {mynickname !== nickname ? <div className="chat_nick">{nickname}</div> : "null"}        
          {/* message */}
          <div className="chat_content">
            <div className="chat_message">{chatMessage}</div>
          </div>
        </div>
      ))
      console.log(temp,chats,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      return temp;
    }

  };

  return (
    <>
      <ChatContainer>
        <p className="header_modal_title">
          채팅방입니다
          <label>
            <input className="header_modal_checkbox" name='commonCheck' type="checkbox" onChange={onChange}/>
            채팅
          </label>
          <label>
            <input className="header_modal_checkbox" name='qestionCheck' type="checkbox" onChange={onChange}/>
            질문
          </label>
        </p>        
        <div className="header_modal_hr"></div>

        <div className="group_chat_container">
          {/* 채팅container */}
          <div className="chat_render_oneChat">          
            {renderChat()}
          </div>

          {/* 하단 메세지 작성 div block => inputbox + 전송버튼(span)*/}
          <div>
          <label><input type="checkbox" name="queCheck" onChange={onChat}/>질문</label>
          {/* <input type="password">질문</input> */}
          <div className="chat_textfield_container">
            <input
              type="text"
              className="chat_textfield"
              placeholder="메시지를 작성해주세요."
              name="oneChat"
              value={chatMessage}
              onChange={sendMessage}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendChat();
                }
              }}
            />
            <button className="chat_send_btn" onClick={sendChat}>+</button>
          </div>
          </div>
        </div>
      </ChatContainer>
    </>
  );
}

export default LectureChating;

const ChatContainer = styled.div`
  position: relative;
  height: 80vh;
  margin: 0 4.17vw;
  box-shadow: 0px 4px 35px 4px rgba(162, 162, 162, 0.25);
  border-radius: 16px;
  box-sizing: border-box;
  width: 22%;

  .group_chat_container {
    padding: 18px;
    height: calc(100% - 150px);
  }
  .chat_render_oneChat {
    height: 100%;
    overflow: auto;
  }
  .chat_textfield_container {
    display:flex;
    justify-content:space-between;
    position: absolute;
    bottom: 20px;
    width: 92%;
    left: 50%;
    transform: translateX(-50%);
  }
  .header_modal_title {
    margin: 3.07vh 18px 2.56vh;
  }
`;

const BlockChat = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;
  text-align: center;
  z-index: 1;

  > .blockBG {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    opacity: 0.8;
    border-radius: 16px;
  }
  > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4.17vw;
    opacity: 1;
    z-index: 1;
  }

  &&.focusTime {
    display: block;
  }
`;
