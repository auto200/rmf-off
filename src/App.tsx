import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/themes";
import Header from "./components/Header";
import Tails from "./components/Tails";
import Player from "./components/Player";
import axios from "axios";
import { decode } from "ent";
import PlayerContext from "./contexts/PlayerContext";
import { headerHeight, playerHeight } from "./utils/constants";
import "typeface-quicksand";
import { Theme } from "./utils/themes";

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  html, body{
    margin: 0;
    padding: 0;
    font-family: Quicksand, consolas;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: color, 0.3s, background-color 0.3s;
    #root{
      margin-top: ${headerHeight + "px"};
      margin-bottom: ${playerHeight + "px"};
    }

    *,*::before,*::after{
      box-sizing: border-box;
    }
  }
`;
const StyledErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.highlightText};
`;
interface FilterTypes {
  stationName: string;
  artist: string;
  songName: string;
}
const filterTypes: FilterTypes = {
  stationName: "Nazwa stacji",
  artist: "Wykonawca",
  songName: "Nazwa piosenki"
};

const sleep = async time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
interface InitialStationInfo {
  id: number;
  stationName: string;
  streamURL: string;
  defaultCover: string;
}
export interface Tail extends InitialStationInfo {
  artist: string;
  songName: string;
  cover: string;
}

const App = () => {
  const [initialStationInfo, setInitialStationInfo] = useState<
    InitialStationInfo[]
  >([]);
  const [error, setError] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [allTails, setAllTails] = useState<Tail[]>([]);
  const [filtredTails, setFiltredTails] = useState<Tail[]>([]);
  const [[currentFilterType, filterValue], setFilter] = useState([
    "stationName",
    ""
  ]);
  const [wideGridLayout, setWideGridLayout] = useState<boolean>(true);

  useEffect(() => {
    const getInitialStationInfo = async () => {
      try {
        const {
          data: { stations }
        } = await axios.get("https://rmfon.pl/json/app.txt");
        const info = stations.map(station => ({
          id: station.id + "",
          stationName: station.name,
          streamURL: station.mp3,
          defaultCover: station.defaultart
        }));
        setInitialStationInfo(info);
      } catch (err) {
        setError(
          "Nie udało się pobrać podstawowych informacji, spróbuj odświerzyć stronę..."
        );
      }
    };

    getInitialStationInfo();

    // loading themes from localstorage
    try {
      const savedDarkMode = JSON.parse(
        window.localStorage.getItem("darkMode")!
      );
      if (savedDarkMode === null) {
        setDarkMode(true);
      } else {
        setDarkMode(savedDarkMode);
      }
    } catch (err) {
      setDarkMode(true);
    }

    try {
      const savedGridLayout = JSON.parse(
        window.localStorage.getItem("wideGridLayout")!
      );
      if (savedGridLayout === null) {
        setWideGridLayout(true);
      } else {
        setWideGridLayout(savedGridLayout);
      }
    } catch (err) {
      setWideGridLayout(true);
    }
  }, []);

  useEffect(() => {
    if (!initialStationInfo.length) return;

    const getRecentData = async () => {
      while (true) {
        try {
          const { data } = await axios.get(
            "https://www.rmfon.pl/stacje/ajax_playing_main.txt"
          );
          delete data.generate;
          const tailsData = initialStationInfo.map(({ id, ...rest }) => ({
            id,
            ...rest,
            artist: decode(data[`radio${id}`].name) || "reklamy / wiadomości",
            songName: decode(data[`radio${id}`].utwor),
            cover: data[`radio${id}`].coverBigUrl
          }));
          setAllTails(tailsData);
          await sleep(15000);
        } catch (err) {}
      }
    };
    getRecentData();
  }, [initialStationInfo]);

  useEffect(() => {
    const filterVal = filterValue.toLowerCase();
    setFiltredTails(() =>
      allTails.filter(tail =>
        tail[currentFilterType].toLowerCase().includes(filterVal)
      )
    );
  }, [allTails, filterValue, currentFilterType]);

  const toggleDarkMode = (): void =>
    setDarkMode((prev: boolean) => {
      localStorage.setItem("darkMode", !prev + "");
      return !prev;
    });

  const toggleGridLayout = (): void =>
    setWideGridLayout(prev => {
      localStorage.setItem("wideGridLayout", !prev + "");
      return !prev;
    });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <>
        <GlobalStyle />
        <Header
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          currentFilterType={currentFilterType}
          filterValue={filterValue}
          setFilter={setFilter}
          filterTypes={filterTypes}
          wideGridLayout={wideGridLayout}
          toggleGridLayout={toggleGridLayout}
        />
        {error ? (
          <StyledErrorMessage>{error}</StyledErrorMessage>
        ) : (
          <PlayerContext>
            <Tails tails={filtredTails} wideGridLayout={wideGridLayout} />
            <Player />
          </PlayerContext>
        )}
      </>
    </ThemeProvider>
  );
};

export default App;
