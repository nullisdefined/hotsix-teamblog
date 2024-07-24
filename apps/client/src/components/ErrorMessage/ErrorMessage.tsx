import React from "react";
import "./ErrorMessage.css";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="error-message-container">
      <div className="error-message">
        <h2>ERROR</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
