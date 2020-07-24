
const {ccclass, property} = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property({
        type:cc.Button,
        tooltip:'按钮'
    })
    begin_button:cc.Button = null;

    start () {
        cc.loader.loadRes('sound/bgSound/login',cc.AudioClip,(err,res)=>{
            let bgMusicId = cc.audioEngine.playMusic(res,true);
            cc.audioEngine.setMusicVolume(0.5);
        })
    }


    goToGameScene(){
        this.begin_button.enabled = false;
        cc.director.loadScene('level');
        // cc.loader.loadRes('sound/login/gameBegin',cc.AudioClip,(err,res)=>{
        //     let effectId =  cc.audioEngine.playEffect(res,false);
        //     cc.audioEngine.setFinishCallback(effectId,()=>{
        //         cc.director.loadScene('level');
        //     })
        // })
        
    }

    // update (dt) {}
}
