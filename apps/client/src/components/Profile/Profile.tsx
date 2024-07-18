import { FC } from "react";
import { BsEmojiWinkFill, BsGithub, BsEnvelopeAtFill } from "react-icons/bs";
import "./Profile.css";

type TProfileProps = {
  nickname: string;
  description: string;
  email: string;
  img?: string;
  gitUrl?: string;
};

const Profile: FC<TProfileProps> = ({
  nickname,
  description,
  email,
  img,
  gitUrl,
}) => {
  return (
    <div className="Profile">
      <div className="Title">
        <div className="Thumb">
          {img ? <img src={img} alt={nickname} /> : <BsEmojiWinkFill />}
        </div>
        <div className="Text">
          <h2>{nickname}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="Icons">
        <a href={`mailto:${email}`}>
          <BsEnvelopeAtFill size="24" />
        </a>
        {gitUrl ? (
          <a href={gitUrl}>
            <BsGithub size="24" />
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
