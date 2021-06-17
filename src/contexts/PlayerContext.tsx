import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;  
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
  hasNext : boolean;
  hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children : ReactNode;
}

export function PlayerContextProvider({ children } : PlayerContextProviderProps ){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setisLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode){
    setEpisodeList([episode]);
    setcurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setcurrentEpisodeIndex(index);
    setIsPlaying(true);
  };

  function togglePlay(){
    setIsPlaying(!isPlaying);
  };
  
  function toggleLoop(){
    setisLooping(!isLooping);
  };

  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  };

  function clearPlayerState(){
    setEpisodeList([]);
    setcurrentEpisodeIndex(0);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  };

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext     = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext(){
    if(isShuffling){
      const NextRandomEpisodeIndex = Math.floor((Math.random() * episodeList.length))
      setcurrentEpisodeIndex(NextRandomEpisodeIndex);
    }else if (hasNext){
      setcurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
   
  }

  function playPrevious() {
    if(hasPrevious){
      setcurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }
  
  return(
    <PlayerContext.Provider 
      value={{ 
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        isPlaying,
        isLooping,
        isShuffling,
        setPlayingState,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        playNext,
        playPrevious,
        clearPlayerState,
        hasNext,
        hasPrevious,
      }}
    >
    {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () =>{
  return useContext(PlayerContext)
}