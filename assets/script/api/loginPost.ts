import GlobalVars from '../global/global'

export function loginPostApi(url, body, txtlabel, username) {

    //rest api
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            console.log("whats response " + response);
            console.log(response == '"match"')
            if (response == '"match"') {
                console.log("login in")
                txtlabel.string = "login successful"

                GlobalVars.gusername = username
                cc.director.loadScene('gameScene')
            } else if (response == '"doubleLogin"') {
                console.log("double login")
                txtlabel.string = "double login"
            }
            else {
                txtlabel.string = "wrong username/password"
            }
        }
    };

    xhr.send(JSON.stringify(body));
}