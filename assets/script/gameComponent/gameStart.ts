export default function startCountdown(seconds, label) {
    let counter = seconds;

    const interval = setInterval(() => {
        label = counter
        console.log(counter);
        counter--;

        if (counter < 0) {
            clearInterval(interval);
            console.log('Ding!');
        }
    }, 1000);
}