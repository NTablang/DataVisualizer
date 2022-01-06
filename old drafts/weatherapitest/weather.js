function setup() {
    createCanvas(200,200);
    loadJSON("https://api.openweathermap.org/data/2.5/weather?q=Hyattsville&APPID=ae911c744d51d02db2976757bc2af640&units=metric");
}
function gotData(data) {
    println(data);
}
function draw() {
    background(0);
}