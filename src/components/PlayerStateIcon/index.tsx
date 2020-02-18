import React from "react";
import styled from "styled-components";
import { FaPlay, FaPause } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { PlayerState } from "../../contexts/PlayerContext";

const LoadingButton = styled(AiOutlineLoading)`
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
const PlayerStateIcon = ({
  playerState,
  ...props
}: {
  playerState: PlayerState;
}) => {
  let Button = FaPlay;

  if (playerState === "PAUSED") {
    Button = FaPlay;
  } else if (playerState === "PLAYING") {
    Button = FaPause;
  } else if (playerState === "LOADING") {
    Button = LoadingButton;
  }

  return <Button {...props} />;
};

export default PlayerStateIcon;
