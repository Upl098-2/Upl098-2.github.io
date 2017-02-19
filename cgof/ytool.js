var width = 0, height = 0, keyCode = null, mouseX = null, mouseY = null, mouseClick = null, touches = null, touchX = null, touchY = null;


//KEYCODES
const UP_ARROW    = 38,
    DOWN_ARROW  = 40,
    LEFT_ARROW  = 37,
    RIGHT_ARROW = 39,
    SPACE       = 32
    KEY_W       = 87,
    KEY_A       = 65,
    KEY_D       = 68,
    KEY_S       = 83;

//MOUSE TYPES
const LEFT_CLICK = 1,
      RIGHT_CLICK = 2,
      MOUSE_WHEEL = 3,
      MOUSE_MOVE = 4;

var ytool_holder =
{
    interval1: null,
    frameRate: 60,
    fillStyle: "black",
    canvas: null,
    ctx: null,
    clearColor: "white",
    noBorder: false
};

const newCanvas = function (dimX, dimY, defCl)
{
    if(!dimX || !dimY || ytool_holder.canvas)return;
    defCl = defCl ? defCl : "white";
    ytool_holder.clearColor = defCl;
    var c = document.createElement("CANVAS");
    c.setAttribute("style", "position:absolute; top:0px; left:0px; " + (ytool_holder.noBorder ? "" : "border:0.5px solid gray;"));
    c.setAttribute("id", "ytool-canvas");
    c.setAttribute("width", dimX);
    c.setAttribute("height", dimY);
    width = dimX;
    height = dimY;
    document.body.appendChild(c);
    ytool_holder.canvas = document.getElementById("ytool-canvas");
    ytool_holder.ctx = ytool_holder.canvas.getContext("2d");
    ytool_holder.ctx.fillStyle = "black";
    ytool_holder.ctx.strokeStyle = "black";
    clear();
};

const remCanvas = function () { if(ytool_holder.canvas){ ytool_holder.canvas = null; ytool_holder.ctx = null; width = 0; height = 0; ytool_holder.fillStyle = "black"; } };

const onLoaded = function () {
    if(setup !== undefined)setup();
    else throw new Error("You need to define a setup function");
    
    //Setup other listeners here
    document.addEventListener("mousemove", function(event){ onMouse(event, MOUSE_MOVE); }, false);
    document.addEventListener("click", function(event){ onMouse(event, LEFT_CLICK); }, false);
    document.addEventListener("contextMenu", function(event){ onMouse(event, LEFT_CLICK); }, false);
    document.addEventListener("keypressed", onKeyPressed, false);
    document.body.addEventListener("touchmove", onTouchMove, false);
    document.body.addEventListener("touchstart", onTouchDown, false);
    document.body.addEventListener("touchend", onTouchUp, false);
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
    
    if(update !== undefined)ytool_holder.interval1 = setInterval(function(){ update(); }, 1000/ytool_holder.frameRate);
    else throw new Error("You need to define an update function");
};

const print = console.log;

const frameRate = function (fr) { if(fr)ytool_holder.frameRate = fr; };

const onKeyPressed = function(e)
{
    //e.preventDefault();
    keyCode = e.keyCode;
    if(keyPressed)keyPressed();
};

const onKeyDown = function(e)
{
    //e.preventDefault();
    keyCode = e.keyCode;
    if(keyDown)keyDown();
};

const onKeyUp = function(e)
{
    //e.preventDefault();
    keyCode = e.keyCode;
    if(keyUp)keyUp();
};

const onMouse = function(e, type)
{
    //e.preventDefault();
    mouseX = e.pageX;
    mouseY = e.pageY;
    mouseClick = type;
    switch(type)
    {
        case MOUSE_MOVE:
            if(mouseMoved)mouseMoved();
            break;
        default:
            if(mouseClicked)mouseClicked();
            break;
    }
    mouseClick = null;
};

const fill = function (fill) { if(fill)ytool_holder.fillStyle = fill; ytool_holder.ctx.fillStyle = ytool_holder.fillStyle; };
const stroke = function (stroke){ if(stroke)ytool_holder.ctx.strokeStyle = stroke; };
const font = function (font){ if(font)ytool_holder.ctx.font = font; };

const grid = function(cellWH, w)
{
    w = w ? w : 1;
    
    for(i = 0; i < width; i+= cellWH)
        {
            if(i == 0)continue;
            line(i, 0, i, height, w);
        }
    for(i = 0; i < height; i+= cellWH)
        {
            if(i == 0)continue;
            line(0, i, width, i, w);
        }
};

const line = function (x, y, tx, ty, w)
{
    w = w ? w : 1;
    var ctx = ytool_holder.ctx;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = w;
    ctx.lineTo(tx, ty);
    ctx.stroke();
};

const circle = function(mx, my, r)
{
    var ctx = ytool_holder.ctx;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, 2*Math.PI);
    ctx.stroke();
};

const circleFill = function(mx, my, r)
{
    var ctx = ytool_holder.ctx;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, 2*Math.PI);
    ctx.fill();
};

const rect = function(x, y, w, h)
{
    var ctx = ytool_holder.ctx;
    ctx.strokeRect(x,y,w,h);
};

const rectFill = function(x, y, w, h)
{
    var ctx = ytool_holder.ctx;
    ctx.fillRect(x,y,w,h);
};

const clear = function()
{
    fill(ytool_holder.clearColor);
    rectFill(0,0,width,height);
    fill(ytool_holder.fillStyle);
};

const image = function (url, x, y, w, h)
{
    if(url === undefined)return;
    x = x ? x : 0;
    y = y ? y : 0;
    w = w ? w : 100;
    h = h ? h : 100;
    var img = document.createElement("IMG");
    img.setAttribute("widht", w);
    img.setAttribute("widht", h);
    img.setAttribute("src", url);
    ytool_holder.ctx.drawImage(img, x, y, w, y);
};

const text = function (str, x, y, mw)
{
    if(str === undefined)return;
    x = x ? x : 0;
    y = y ? y : 0;
    mw = mw ? mw : null;
    if(mw !== null)
        ytool_holder.ctx.strokeText(str, x, y, mw);
    else
        ytool_holder.ctx.strokeText(str, x, y);
};

const textFill = function (str, x, y, mw)
{
    if(str === undefined)return;
    x = x ? x : 0;
    y = y ? y : 0;
    mw = mw ? mw : null;
    if(mw !== null)
        ytool_holder.ctx.fillText(str, x, y, mw);
    else
        ytool_holder.ctx.fillText(str, x, y);
};

const v2 = function (x, y) { this.x = x ? x : 0; this.y = y ? y : 0; };
const v3 = function (x, y, z) { this.x = x ? x : 0; this.y = y ? y : 0; this.z = z ? z : 0; };

const controlAdd = function (tag, parent, arr)
{
    if(tag === null || parent === null)return;
    arr = (arr === null) ? [] : arr;
    var html = document.createElement(tag);
    for(i = 0; i < arr.length; i++)
        {
            if(arr[i].indexOf("=") == -1){ html.setAttribute(arr[i]+"", ""); continue; }
            var t1 = arr[i].substring(0,arr[i].indexOf("="));
            var t2 = arr[i].substring(arr[i].indexOf("=")+1);
            html.setAttribute(t1, t2);
            t1 = "", t2 = "";
            continue;
        }
    parent.appendChild(html);
};

const onTouchDown = function(event)
{
    touches = event.touches;
    touchX = touches[0].pageX;
    touchY = touches[0].pageY;
    touchedDown();
    touches = null;
};

const onTouchUp = function(event)
{
    touches = event.touches;
    touchX = touches[0].pageX;
    touchY = touches[0].pageY;
    touchedUp();
    touches = null;
};

const onTouchMove = function(event)
{
    touches = event.touches;
    touchX = touches[0].pageX;
    touchY = touches[0].pageY;
    touchMoved();
    touches = null;
};

const password = function(text, password)
{
    text = (text === null) ? "Please enter the password:" : text;
    password = (password === null) ? "ytool_enabled123456" : password;
    if(prompt(text,"") != password)location.replace("about:blank");
};

const noBorder = function(){ ytool_holder.noBorder = true; };

function keyPress(){}
function keyDown(){}
function keyUp(){}
function mouseMoved(){}
function mouseClicked(){}
function touchMoved(){}
function touchedDown(){}
function touchedUp(){}

window.onload = onLoaded;