import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

function LectureChating() {
  const [chatMessage, setChatMessage] = useState(""); //input message
  const [chats, setChat] = useState([]); //chat 내용 모음
  const [check, setChecked] = useState({
    commonCheck:'',   
    questionCheck:'', 
  }); 
  const [chatcheck, setChatChecked] = useState({
    queCheck:'',       
  });
  const [isConnect, setConnect] = useState(false);
  const {commonCheck, questionCheck} = check;
  const {queCheck} = chatcheck;
  
  const params = useParams(); 
  const socket = useRef();
  //const socket = useRef();
  
  const url = "ws://xpecter.shop";
  const roomName = params.roomName;
  
  let mynickname = "woohyun";
  //let nickname = sessionStorage.getItem("nickname");

   useEffect(async () => {
    if(isConnect === false){
      socket.current = io(url);
      socket.current.emit("init",{nickname:mynickname});
      await socket.current.on("initOk",()=>{
        socket.current.emit("joinRoom", {roomName});
        });
      }
      setConnect(true);
    
      socket.current.on("receiveChatMessage",({nickname,chatMessage})=>{         
        const newChat = [...chats, {nickname:nickname, chatMessage, check : "common"} ] 
        setChat(newChat);})
  
      socket.current.on("receiveQuestionMessage",({nickname,chatMessage})=>{       
        const newChat = [...chats, {nickname:nickname, chatMessage, check : "question"} ] 
        setChat(newChat);})       

    return () => {            
      socket.current.disconnect();
      setConnect(false);
    };

  },[chats]);

  const sendChat = () => {        
    if (chatMessage !== "") { 
      if(queCheck === true){        
        socket.current.emit(
          "sendQuestionMessage",
          {chatMessage, roomName},
          (message)=>{          
            setChat([...chats, { nickname:mynickname, chatMessage:message, check : "question" }]);          
          });
          setChatMessage("");
      } else {        
          socket.current.emit("sendChatMessage", {chatMessage, roomName},(message)=>{          
            setChat([...chats, { nickname:mynickname, chatMessage:message, check : "common" }]);          
          });
          setChatMessage(""); //input 비워준다
        }
    }
  };

  const sendMessage = useCallback((e) => {
    setChatMessage(e.target.value);   
  },[chatMessage]);

  const onChange = useCallback((e) => {
    const {name, checked} = e.target
    setChecked({
      ...check, 
      [name]:checked,
    })
  },[check])

  const onChat = useCallback((e) => {
    const {name, checked} = e.target
    setChatChecked({
      ...chatcheck,
      [name]:checked,
    })
  },[chatcheck])
  
  const renderChat = () => { //닉네임 + 내용    
    if(commonCheck === true){      
      return chats.filter(chat => chat.check === "common").map(({ nickname, chatMessage }, index) =>(
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
      return chats.filter(chat => chat.check === "question").map(({ nickname, chatMessage }, index) =>(
        <div key={index} className={mynickname === nickname ? "chat_from_me" : "chat_from_friend"}> 
          {/* user nickname */}
          {mynickname !== nickname ? <div className="chat_nick">{nickname}</div> : "null"}        
          {/* message */}
          <div className="chat_content">
             <h3>질문글</h3>
            <div className="chat_message">{chatMessage}</div>            
          </div>
        </div>
      ))
    } else {
      const temp = chats.map(({ nickname,chatMessage, check }, index) => (      
        <div key={index} className={mynickname === nickname ? "chat_from_me" : "chat_from_friend"}> 
          {/* user nickname */}
          {mynickname !== nickname ? <div className="chat_nick">{nickname}</div> : "null"}        
          {/* message */}
          <div className="chat_content">
            {check === "question" ? <h3>질문글</h3> : null}
            <div className="chat_message">{chatMessage}</div>
          </div>
        </div>
      ))
      return temp;
    }

  };

  return (
    <>    
      <ChatContainer>
        <p className="header_modal_title">
          채팅방입니다
        </p>        
          <label>
            <input 
              className="header_modal_checkbox" 
              name='commonCheck' 
              type="checkbox" 
              onChange={onChange}
            />
            채팅
          </label>
          <label>
            <input 
              className="header_modal_checkbox" 
              name='questionCheck' 
              type="checkbox" 
              onChange={onChange}
            />
            질문
          </label>
        <div className="header_modal_hr"></div>

        <div className="group_chat_container">
          {/* 채팅container */}
          <div className="chat_render_oneChat">          
            {renderChat()}
          </div>
          
          <div>
          <label>
            <input 
              type="checkbox" 
              name="queCheck" 
              onChange={onChat}
            />
            질문
          </label>
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
  .chat_from_me {
    border:1px solid black;
    border-radius: 10px;    
  }
  ."chat_from_friend"{
    border:1px solid black;
    border-radius: 10px; 
  }
`;
