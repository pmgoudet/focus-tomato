function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    let interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10); //calculate int + rest
        seconds = parseInt(timer % 60, 10); 
        minutes = minutes < 10 ? "0" + minutes : minutes; // format 00:00
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(interval);
            console.log('fim')
        }
    }, 1000);
}
window.onload = function () {
    var duration = 60 * 1; // Converter para segundos
        display = document.querySelector('#timer'); // selecionando o timer
    startTimer(duration, display); // iniciando o timer
};
