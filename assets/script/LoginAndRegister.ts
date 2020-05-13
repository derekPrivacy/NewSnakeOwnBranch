// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { getApi } from './api/get';
import { loginPostApi } from './api/loginPost';
import { registerPostApi } from './api/registerPost';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    node: cc.Node = null;

    @property(cc.EditBox)
    username: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;

    @property(cc.Label)
    textLabel: cc.Label = null;

    login() {
        var body = { 'user': this.username.string, 'password': this.password.string };
        //var url = "https://cors-anywhere.herokuapp.com/http://18.219.41.101:8081/api/validateUser"
        var url = "http://18.219.41.101:8081/api/validateUser"

        loginPostApi(url, body, this.textLabel, this.username.string)
    }

    register() {
        var body = { 'user': this.username.string, 'password': this.password.string };
        //var url = "https://cors-anywhere.herokuapp.com/http://18.219.41.101:8081/api/createUser"
        var url = "http://18.219.41.101:8081/api/createUser"


        //check is email
        var reEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        //check password is mix
        var rePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

        if (!reEmail.test(this.username.string)) {
            this.textLabel.string = "user name must be email address"
        }
        else if (!rePassword.test(this.password.string)) {
            this.textLabel.string = "password must be upper lower case and number mix"
        } else {
            registerPostApi(url, body, this.textLabel)
        }

    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log("u ok?????")
    }

}

