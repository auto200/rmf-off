import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { usePlayer } from "../../contexts/PlayerContext";
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import { playerHeight } from "../../utils/constants";
import PlayerStateIcon from "../PlayerStateIcon";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import useDebounce from "../../utils/hooks/useDebounce";

const Wrapper = styled.div<{ isShown: boolean }>`
  display: grid;
  grid-template-columns: 20% 12% 33% 15% 20%;
  grid-template-rows: 100%;
  align-items: center;
  padding: 5px;
  grid-gap: 5px;
  height: ${playerHeight + "px"};
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%)
    ${({ isShown }) =>
      isShown ? `translateY(0)` : `translateY(${playerHeight + "px"})`};
  transition: transform 1s ease;
  background-color: ${({ theme }) => theme.colors.secondary};
  width: 100%;
  max-width: 500px;
  border-top: 1px solid ${({ theme }) => theme.colors.regularText};
  padding: 0 15px;
`;
const Field = styled.div<{ highlight?: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: ${({ theme, highlight }) =>
    highlight ? theme.colors.highlightText : theme.colors.regularText};
`;
const Cover = styled.img`
  max-height: 85%;
`;
const TrackInfoContainer = styled.div`
  overflow: hidden;
  max-width: 100%;
`;
const AudioSettingsContainer = styled.div`
  position: relative;
  color: ${({ theme }) => theme.colors.regularText};
  font-size: 35px;
  display: grid;
  place-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;
const VolumeSliderContainer = styled.div`
  position: absolute;
  bottom: ${playerHeight - 15 + "px"};
  z-index: 20;
  width: 35px;
  display: grid;
  place-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.regularText};
  transform: translateY(15%) scale(0);
  transform-origin: bottom;
  transition: transform 0.5s ease;

  ${AudioSettingsContainer}:hover & {
    transform: translateY(0) scale(1);
  }
  /*overriting imported slider styles */
  .rangeslider {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .rangeslider__fill {
    background-color: ${({ theme }) => theme.colors.highlightText};
  }
  .rangeslider__labels {
    visibility: hidden;
  }
  .rangeslider__handle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    left: -5px;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;
const ActionButtonWrapper = styled.div`
  color: ${({ theme }) => theme.colors.regularText};
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;
const AudioIcon = ({ volume }: { volume: number }) => {
  if (volume === 0) return <FaVolumeMute />;
  if (volume > 0 && volume < 51) return <FaVolumeDown />;
  return <FaVolumeUp />;
};

const Player = () => {
  const {
    station: { stationName, cover, songName, artist, streamURL },
    playerState,
    setPlayerState,
    handleActionButtonClick
  } = usePlayer();
  const [volume, setVolume] = useState<number>(50);

  const debouncedVolume = useDebounce(volume, 3000);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const savedVolume = window.localStorage.getItem("volume");
    if (savedVolume) {
      setVolume(+savedVolume);
    }
  }, []);

  useEffect(() => {
    //idk it seems to be so loud so thats why divide by value higher than 100 (0-1 range)
    audioRef.current!.volume = volume / 550;
  }, [volume]);

  useEffect(() => {
    window.localStorage.setItem("volume", debouncedVolume);
  }, [debouncedVolume]);

  useEffect(() => {
    if (!audioRef || !audioRef.current) return;

    if (playerState === "PLAYING") {
      audioRef.current.play();
    } else if (playerState === "PAUSED") {
      audioRef.current.pause();
    }
  }, [playerState]);

  return (
    <Wrapper isShown={stationName}>
      <Field>{stationName}</Field>
      <Cover src={cover} />
      <TrackInfoContainer>
        <Field highlight>{songName}</Field>
        <Field>{artist}</Field>
      </TrackInfoContainer>
      <AudioSettingsContainer>
        <AudioIcon volume={volume} />
        <VolumeSliderContainer>
          <Slider
            orientation="vertical"
            value={volume}
            onChange={val => setVolume(val)}
            tooltip={false}
          />
        </VolumeSliderContainer>
      </AudioSettingsContainer>
      <ActionButtonWrapper onClick={() => handleActionButtonClick()}>
        <PlayerStateIcon playerState={playerState} />
      </ActionButtonWrapper>
      <audio
        src={streamURL}
        ref={audioRef}
        onLoadStart={() => setPlayerState("LOADING")}
        onCanPlay={() => {
          if (!audioRef || !audioRef.current) return;
          audioRef.current.play();
        }}
        onPause={() => setPlayerState("PAUSED")}
        onPlaying={() => setPlayerState("PLAYING")}
      />
    </Wrapper>
  );
};

export default Player;
