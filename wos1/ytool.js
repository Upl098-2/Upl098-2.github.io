var canvas, ctx, width, height;

const KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32, A: 65, W: 87, S: 83, D: 68 };
const MOUSE = { MOVE: "MOVE", LEFT: "LEFT", LEFTDOWN: "LEFTDOWN", DBLCLICK: "DBLCLICK", RIGHT: "RIGHT", WHEEL: "WHEEL" };

const FILL = "FILL", STROKE = "STROKE";

var ytool_holder = {
    fps: 60,
    defc: "white",
    interval: null,
    runInterval: function ()
    {
	this.interval = setInterval( function() { update(); }, 1000 / this.fps );
    }
};

const line = function (x, y, tx, ty, w, m){
    if(!ctx)return;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
};

const text = function (text, x, y, font, m){
    if(!ctx)return;
    ctx.font = font;
    if(m == STROKE)
	ctx.strokeText(text, x, y);
    else ctx.fillText(text, x, y); //Standard fill
};

const rect = function (x, y, w, h, m){
    if(!ctx)return;
    if(m == STROKE)
	ctx.strokeRect(x, y, w, h);
    else ctx.fillRect(x, y, w, h); //Standard fill
};

const circle = function(x, y, r, m){
    if(!ctx)return;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    if(m == STROKE)
        ctx.stroke();
    else ctx.fill();
};

const grid = function(s, w){
    if(!ctx)return;
    w = w ? w : 1;
    for(i = s; i < width; i+=s)
        { line(i, 0, i, height, w, FILL); }
    for(i = s; i < height; i+=s)
    { line(0, i, width, i, w, FILL); }
}

const createCanvas = function(w, h, c, b){
    if(canvas || ctx)return;
    width = w; height = h;
    ytool_holder.defc = c;
    var foo = document.createElement("CANVAS");
    foo.setAttribute("id", "ytool_canvas");
    foo.setAttribute("width", w);
    foo.setAttribute("height", h);
    if(!b)foo.setAttribute("style", "position:absolute;");
    else foo.setAttribute("style", "position:absolute; border:" + b + ";");
    document.body.appendChild( foo );
    canvas = document.getElementById("ytool_canvas");
    ctx = canvas.getContext("2d");
}

const frames = function (fr) { ytool_holder.fps = fr; };
const clear = function () { if(!ctx)return; var foo = ctx.fillStyle; ctx.fillStyle = ytool_holder.defc; rect(0, 0, width, height, FILL); ctx.fillStyle = foo; };
const pause = function(){ if(ytool_holder.interval)clearInterval(ytool_holder.interval); ytool_holder.interval = null; };
const unpause = function (){ if(!ytool_holder.interval)ytool_holder.runInterval(); };

const fill = function (c) { if(!ctx)return; ctx.fillStyle = c; };
const stroke = function (c) { if(!ctx)return; ctx.strokeStyle = c; };

const keyUp = function (e){
    onKey(e.keyCode, e.target, e);
};

const keyDown = function (e){
    onKDown(e.keyCode, e.target, e);
};

const leftClick = function(e)
{
    onMouse(MOUSE.LEFT, e.target, e);
};

const mdown = function (e)
{
    onMouse(MOUSE.LEFTDOWN, e.target, e);
};

const mouseMove = function(e)
{
    onMouse(MOUSE.MOVE, e.target, e);
};

const rightClick = function(e)
{
    onMouse(MOUSE.RIGHT, e.target, e);
};

const constrainX = function( x, width_)
{
    if(x < 0)return 0;
    if(x+width_ > width)return width-width_;
    return x;
};

const constrainY = function( y, height_)
{
    if(y < 0)return 0;
    if(y+height_ > height)return height-height_;
    return y;
};

const dtf = function ()
{
    return new Date().toString().substring(0,24);
};

const randint = function(low, high)
{
    if(low >= high)return low;
    else return Math.floor( ( Math.random() * high ) + low);
};

window.onload = function (){
    start();

    document.addEventListener("keyup", keyUp, false);
    document.addEventListener("keydown", keyDown, false);
    
    document.addEventListener("mousemove", mouseMove, false);
    document.addEventListener("click", leftClick, false);
    document.addEventListener("mousedown", mdown, false);
    document.addEventListener("contextmenu", rightClick, false);
    
    unpause();
};

function start()  {}
function update() {}
function onKey(k, where, e) {}
function onKDown(k, where, e) {}
function onMouse(cl, where, e) {}