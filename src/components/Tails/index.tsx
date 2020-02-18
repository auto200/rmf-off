import React from "react";
import styled from "styled-components";
import Tail from "./Tail";
import { Tail as TailInterface } from "../../App";
import { usePlayer } from "../../contexts/PlayerContext";

const Wrapper = styled.div<{ wideGridLayout: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ wideGridLayout }) =>
    wideGridLayout
      ? "repeat(auto-fit, minmax(300px, 1fr))"
      : "repeat(auto-fit, minmax(250px, 1fr))"};
  grid-gap: 15px;
  justify-content: space-around;
  padding: 15px;
  overflow: hidden;
`;
interface Props {
  tails: TailInterface[];
  wideGridLayout: boolean;
}
const Tails = ({ tails, wideGridLayout }: Props) => {
  const {
    currentStationId,
    playerState,
    handleActionButtonClick
  } = usePlayer();
  return (
    <Wrapper wideGridLayout={wideGridLayout}>
      {tails.map(
        ({
          id,
          stationName,
          cover,
          songName,
          artist,
          streamURL,
          defaultCover
        }) => {
          return (
            <Tail
              key={`radio${id}`}
              stationName={stationName}
              cover={cover}
              songName={songName}
              artist={artist}
              defaultCover={defaultCover}
              streamURL={streamURL}
              //player props
              id={id}
              isActive={currentStationId === id}
              handleActionButtonClick={handleActionButtonClick}
              playerState={playerState}
            ></Tail>
          );
        }
      )}
    </Wrapper>
  );
};

export default Tails;
