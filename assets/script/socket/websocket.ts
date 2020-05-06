export function Websocket(object, msgType, roomNumber) {

    return new Promise(function (resolve, reject) {
        console.log("ws passed room number " + roomNumber)

        var socket = new WebSocket('ws://3.14.4.184:8081/api/ws');

        // on websocket error
        socket.addEventListener('error', function (event) {
            console.log("error")
            console.log(event);
        });

        // Connection opened
        socket.addEventListener('open', function (event) {
            console.log("connected")
            var msg = { "type": msgType, "RoomID": parseInt(roomNumber) }

            if (msgType == "hello") {
                msg["data"] = "";
            }
            else if (msgType == "addPlayer") {
                msg["data"] = object["input"]
            } else if (msgType == "updateAvatar") {
                msg["avatarId"] = object["avatarId"]
                msg["positionX"] = object["positionX"]
                msg["positionY"] = object["positionY"]
                msg["bodyLength"] = object["bodyLength"]
                msg["direction"] = object["direction"]
            } else if (msgType == "spawnFood") {
                msg["foodPositionX"] = object["foodPositionX"]
                msg["foodPositionY"] = object["foodPositionY"]
            }

            console.log("in this case " + JSON.stringify(msg))

            socket.send(JSON.stringify(msg));

        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log("this stage")

            console.log("message")
            console.log("respoonse back " + JSON.parse(JSON.stringify(event.data)))
            resolve(JSON.parse(JSON.stringify(event.data)))

        });
    })
}