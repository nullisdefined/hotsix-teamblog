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
};

const Button: FC<TButtonProps> = ({
  text,
  type,
  spacing,
  size = "SMALL",
  onClick,
  link,
}) => {
  return link ? (
    <Link to={link}>
      <button className={`Button Button_${type} Button_${size} ${spacing}`}>
        {text}
      </button>
    </Link>
  ) : (
    <button
      onClick={onClick}
      className={`Button Button_${type} Button_${size} ${spacing}`}
    >
      {text}
    </button>
  );
};

export default Button;
