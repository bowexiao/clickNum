import { Global } from "./Global";
import LevelItem from "./LevelItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {

    @property({
        type:cc.Prefab,
        tooltip:'关卡',
    })
    level_item:cc.Prefab = null;

    @property({
        type:cc.ScrollView,
        tooltip:'容器'
    })
    scrollView:cc.ScrollView = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.initItem();
    }

    private initItem(){
        this.scrollView.content.removeAllChildren();

        

        for (let i = 0; i < 99; i++) {
            
            let lv = i;

            let item = cc.instantiate(this.level_item);
            item.getComponent(LevelItem).init(i + 1);

            item.parent = this.scrollView.content;

            item.on(cc.Node.EventType.TOUCH_START,()=>{
                cc.log('--------1111-------')
                this.startGame();
            });
            
        }
    }

    startGame(){
        cc.director.loadScene('Game')
    }

    // update (dt) {}
}
