import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Notification from './components/Notification';
const socket = io('/');

const App = () => {
  const [ score, setScore ] = useState(20);
  const [ nextWin, setNextWin ] = useState(10);
  const [ notificationMsg, setNotificationMsg ] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      if(localStorage.getItem('score')) {
        socket.emit('return', Number(localStorage.getItem('score')));
      }
    });

    socket.on('update', (status) => {
      setScore(status.score);
      setNextWin(status.nextWin);
      localStorage.setItem('score', status.score);

      // Player won
      if (status.won) {
        setNotificationMsg(`You won ${status.won} points!`);

        setTimeout(() => {
          setNotificationMsg(null);
        }, 3000);
      }

      // Ask if the player wants to start over when losing
      if (status.score === 0
        && window.confirm('0 pistettä! Haluatko aloittaa alusta?')) {
          socket.emit('restart');
      }
    });
  }, []);

  const handleClick = (e) => {
    if (score <= 0) {
      if(window.confirm('0 pistettä! Haluatko aloittaa alusta?')) {
        socket.emit('restart');
      }

      return;
    }

    socket.emit('click');
  };
  
  return (
    <div className="peli">
      <p className="score">Pisteet: {score}</p>
      <button onClick={handleClick} className="painike">CLICK!</button>
      <p className="nextwin">Seuraavaan voittoon {nextWin} painallusta</p>
      <Notification message={notificationMsg} />
    </div>
  );
};

export default App;