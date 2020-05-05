export function loginPostApi(url, body, txtlabel) {

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
                cc.director.loadScene('gameScene')
            } else {
                txtlabel.string = "wrong username/password"
            }
        }
    };

    xhr.send(JSON.stringify(body));
}