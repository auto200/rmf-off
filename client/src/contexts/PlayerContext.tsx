import React, { createContext, useContext, useState, useEffect } from "react";
import { IStation } from "../App";

export enum PLAYER_STATES {
  PAUSED,
  PLAYING,
  LOADING,
}

const PlayerContext = createContext<{
  currentStation: IStation | null;
  playerState: PLAYER_STATES;
  setPlayerState: (state: PLAYER_STATES) => void;
  changeStation: (stationId: number) => void;
  togglePlayerState: () => void;
}>({
  currentStation: null,
  playerState: PLAYER_STATES.PAUSED,
  setPlayerState: () => {},
  changeStation: () => {},
  togglePlayerState: () => {},
});

const PlayerContextProvider: React.FC<{ stations: IStation[] }> = ({
  children,
  stations,
}) => {
  const [currentStation, setCurrentStation] = useState<IStation | null>(null);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);

  useEffect(() => {
    if (!currentStation) return;
    const newStationData = stations.find((s) => s.id === currentStation.id);
    if (newStationData) {
      setCurrentStation(newStationData);
    }
  }, [stations]);

  const changeStation = (stationId: number) => {
    if (stationId !== currentStation?.id) {
      const newStation = stations.find(({ id }) => id === stationId);
      if (newStation) {
        setCurrentStation(newStation);
        setPlayerState(PLAYER_STATES.PLAYING);
      }
    }
  };

  const togglePlayerState = () => {
    if (playerState === PLAYER_STATES.PLAYING) {
      setPlayerState(PLAYER_STATES.PAUSED);
    } else if (playerState === PLAYER_STATES.PAUSED) {
      setPlayerState(PLAYER_STATES.PLAYING);
    }
  };

  const value = {
    currentStation,
    playerState,
    setPlayerState,
    changeStation,
    togglePlayerState,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

export const usePlayer = () => useContext(PlayerContext);
