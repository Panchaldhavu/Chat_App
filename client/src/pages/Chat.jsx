import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcom";
import ChatContainer from "../components/ChatContainer";
import {io} from 'socket.io-client'

const Chat = () => {
  const soket = useRef()
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      socket.current = io("http://localhost:5000");
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect( () => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(
         JSON.parse(
          localStorage.getItem("chat-app-user")
        )
      );
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`http://localhost:5000/api/auth/alluser/${currentUser._id}`)
          setContacts(data.data)
        } else {
          navigate('/setAvatar')
        }
      }
    }
    getData()
  }, [currentUser])

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };


  return (
    <>
      <Container>
        <div className='container' >
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
          )}
        </div>
      </Container>
    </>
  )
}

export default Chat


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;