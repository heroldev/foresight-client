import { bgSongData } from "./types"

const SND_FOLDER_PATH = "../../../snd/"


export const GetSongData = (): bgSongData[] => {

  const songData: bgSongData[] = [
    {
      name: "Title Theme",
      artist: "Tsukasa Tawada",
      filepath: SND_FOLDER_PATH + "BattleRevolution/TitleScreen.mp3",
      imgpath: ""
    },
    {
      name: "Nintendo WFC Menu",
      artist: "Tsukasa Tawada",
      filepath: SND_FOLDER_PATH + "BattleRevolution/WFCMenu.mp3",
      imgpath: ""
    },
    {
      name: "Beta Track",
      artist: "Tsukasa Tawada",
      filepath: SND_FOLDER_PATH + "BattleRevolution/BetaTrack.mp3",
      imgpath: ""
    },
    {
      name: "Sunset Colosseum",
      artist: "Tsukasa Tawada",
      filepath: SND_FOLDER_PATH + "BattleRevolution/sunsetColo.mp3",
      imgpath: ""
    },






  ]

  return songData
}