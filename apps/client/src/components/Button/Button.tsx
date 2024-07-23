import React, { FC } from "react";
import { Link } from "react-router-dom";
import "./Button.css";

type TButtonProps = {
  text: string;
  type: string;
  spacing?: string;
  size?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  link?: string;
  className?: string;
  buttonType?: "button" | "submit" | "reset";
};

const Button: FC<TButtonProps> = ({
  text,
  type,
  spacing,
  size = "SMALL",
  onClick,
  link,
  buttonType = "button",
}) => {
  return link ? (
    <Link to={link} className={`ButtonLink ${spacing || ""}`}>
      <button
        type={buttonType}
        className={`Button Button_${type} Button_${size}`}
      >
        {text}
      </button>
    </Link>
  ) : (
    <button
      type={buttonType}
      onClick={onClick}
      className={`Button Button_${type} Button_${size} ${spacing || ""}`}
    >
      {text}
    </button>
  );
};

export default Button;
