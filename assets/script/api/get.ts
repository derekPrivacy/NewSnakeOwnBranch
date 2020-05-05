

export function getApi(url) {

    //rest api
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            console.log(response);
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}