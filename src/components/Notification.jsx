import React from 'react';

const Notification = (props) => {
  if (!props.message) {
    return null;
  }
  
  return (
    <div className="notification">
      <p>{props.message}</p>
    </div>
  );
};

export default Notification;