
const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItem extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    init(levelNum){
        this.label.string = levelNum;
    }

    // update (dt) {}
}
