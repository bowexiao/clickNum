import { GameData } from './GameData'
const { ccclass } = cc._decorator;

@ccclass
export  class Global extends cc.Component {
    public static gameData = new GameData();
    
}
