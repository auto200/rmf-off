import React, { createContext, useContext, useState, useEffect } from "react";

interface ContextValue {
  station: any;
  currentStationId: number;
  playerState: PlayerState;
  setPlayerState: (state: PlayerState) => void;
  handleActionButtonClick: () => void;
}

const PlayerContext = createContext<Partial<ContextValue>>({});

// interface PlayerStates {
//   PAUSED: PlayerState;
//   PLAYING: PlayerState;
//   LOADING: PlayerState;
// }
export type PlayerState = "PAUSED" | "PLAYING" | "LOADING";
// export const playerStates: PlayerStates = {
//   PAUSED: "PAUSED",
//   PLAYING: "PLAYING",
//   LOADING: "LOADING"
// };
interface Station {
  id: number;
  stationName: string;
  cover: string;
  songName: string;
  artist: string;
  streamURL: string;
}
export interface HandleActionButtonClick {
  (station?: Station, isActive?: boolean): void;
}
const PlayerContextProvider: React.FC = ({ children }) => {
  const [station, setStation] = useState({});
  const [currentStationId, setCurrentStationId] = useState<Partial<number>>();
  const [playerState, setPlayerState] = useState<PlayerState>("LOADING");

  useEffect(() => {
    //@ts-ignore
    if (station.id) setCurrentStationId(station.id);
  }, [station]);

  const handleActionButtonClick: HandleActionButtonClick = (
    station,
    isActive
  ) => {
    if (station) {
      setStation(station);
    } else {
      if (playerState === "LOADING" && isActive) return;

      if (playerState === "PLAYING") {
        setPlayerState("PAUSED");
      } else if (playerState === "PAUSED") {
        setPlayerState("PLAYING");
      }
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        station,
        currentStationId,
        playerState,
        setPlayerState,
        handleActionButtonClick
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

export const usePlayer = () => useContext(PlayerContext);
