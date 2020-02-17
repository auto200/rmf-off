import React from "react";
import styled from "styled-components";
import PlayerStateIcon from "../../PlayerStateIcon";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaYoutube, FaPlay } from "react-icons/fa";
import DotMenu, { MenuItem } from "./DotsMenu";
import PropTypes from "prop-types";
import { Tail as TailInterface } from "../../../App";
import {
  HandleActionButtonClick,
  PlayerState
} from "../../../contexts/PlayerContext";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  height: 60px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.highlightText};
`;
const CoverContainer = styled(motion.div).attrs(
  ({ cover, defaultCover }: { cover: string; defaultCover: string }): any => ({
    style: {
      backgroundImage: `url(${cover}), url(${defaultCover})`
    }
  })
)`
  position: relative;
  font-size: 70px;
  cursor: pointer;
  width: 95%;
  height: 300px;
  background-position: center;
  background-size: cover;
  -webkit-tap-highlight-color: transparent;

  /* brightness filter */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, ${({ theme }) => theme.imgBrightness});
    transition: background-color 0.3s;
  }
`;

const ActionButtonWrapper = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 100%;
  opacity: ${({ isActive }) => (isActive ? 0.7 : 0)};
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    opacity: ${({ isActive }) => !isActive && 0.7};
  }
`;
const TrackInfo = styled.div`
  color: ${({ theme }) => theme.colors.regularText};
  width: 100%;
  display: grid;
  place-items: center;
  width: calc(100% - 55px);

  h3 {
    margin: 0;
    font-weight: normal;
  }
`;
const MenuButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;
interface Props extends TailInterface {
  isActive: boolean;
  handleActionButtonClick: HandleActionButtonClick;
  playerState: PlayerState;
}
const Tail = ({
  stationName,
  cover,
  songName,
  artist,
  defaultCover,
  streamURL,
  //player props
  id,
  isActive,
  handleActionButtonClick,
  playerState
}: Props) => {
  const handleClick = () => {
    if (isActive) {
      handleActionButtonClick(null, true);
    } else {
      handleActionButtonClick({
        id,
        stationName,
        cover: cover || defaultCover,
        songName,
        artist,
        streamURL
      });
    }
  };
  const query = encodeURIComponent(`${artist} - ${songName}`);
  const handleGoogleSearch = () => {
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };
  const handleYoutubeSearch = () => {
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank"
    );
  };

  return (
    <Wrapper>
      <Title>{stationName}</Title>
      <AnimatePresence exitBeforeEnter>
        <CoverContainer
          cover={cover}
          defaultCover={defaultCover}
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={id + songName}
        >
          <ActionButtonWrapper isActive={isActive}>
            {isActive ? (
              <PlayerStateIcon playerState={playerState} />
            ) : (
              <FaPlay />
            )}
          </ActionButtonWrapper>
        </CoverContainer>
      </AnimatePresence>
      <TrackInfo>
        <h2 style={{ color: isActive && "red" }}>{songName}</h2>
        <h3>{artist}</h3>
      </TrackInfo>
      <MenuButtonContainer>
        <DotMenu>
          <MenuItem icon={<FaGoogle />} onClick={handleGoogleSearch}>
            Szukaj w Google
          </MenuItem>
          <MenuItem icon={<FaYoutube />} onClick={handleYoutubeSearch}>
            Szukaj w YouTube
          </MenuItem>
        </DotMenu>
      </MenuButtonContainer>
    </Wrapper>
  );
};

export default Tail;
