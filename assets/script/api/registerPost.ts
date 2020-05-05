export function registerPostApi(url, body, txtlabel) {

    //rest api
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            console.log(response);
            if (response == '"created"') {
                txtlabel.string = "user created"
            } else {
                txtlabel.string = "username already exists"
            }
        }
    };

    xhr.send(JSON.stringify(body));
}