var inspector, cel;
var xoff = yoff = 0; // Touch offsets for ontouchmove

var dragging = false;
var vd = {};


document.ontouchmove = function (event)
{
    if(dragging)return;
    event.preventDefault();
};

window.onload = function ()
{
    var ins = new Element( "DIV" );
    
        var cancelButton = new Element("DIV");
        cancelButton.set( "id", "cbtn");
        cancelButton.set( "onclick", "hide_inspect();" );
        cancelButton.set("class", "topLeftCBtn");
        cancelButton.appendTo( ins );
        cancelButton.append( Element.newText( "X" ) );
    
        var title = new Element("a");
        title.set( "id", "inspector_title");
        title.set( "class", "topCenterTitle");
        title.appendTo( ins );
        title.append( Element.newText( "Inspector - null" ) );

    ins.set("id", "inspector");
    ins.set("class", "full-overlay");
    ins.appendTo( document.body );
    
    var cdedit = new Element( "DIV" );
    
        cancelButton = new Element( "DIV" );
        cancelButton.set( "id", "cbtn2");
        cancelButton.set( "onclick", "event.target.parentNode.style.display = 'none';");
        cancelButton.set("class", "topLeftCBtn");
        cancelButton.appendTo( cdedit );
        cancelButton.append( Element.newText( "X" ) );
    
        title = new Element( "A" );
        title.set( "id", "cdedit_title");
        title.set( "class", "topCenterTitle");
        title.appendTo( cdedit );
        title.append( Element.newText( "Code Editor - null" ) );

        var editor = new Element( "TEXTAREA" );
        editor.set( "id", "editor" );
        editor.appendTo( cdedit );

    cdedit.set("id", "cdedit");
    cdedit.set("class", "full-overlay");
    cdedit.appendTo( document.body );

    inspector = _("#inspector");

    // Tool

    var toolmgr = new Element( "DIV" );

    toolmgr.set( "id", "toolmgr" );
    toolmgr.set( "style", "top:10px; left:10px;");
    toolmgr.appendTo( document.body );


    /*_("#toolmgr").addEventListener("mousedown", function (event){
        console.log(event.pageX + " " + event.pageY);
        console.log(_('#toolmgr').style.left + " " + _('#toolmgr').style.top);
        xoff = event.pageX - parseInt(_("#toolmgr").style.left);
        yoff = event.pageY - parseInt(_("#toolmgr").style.top);
        console.log(xoff + " " + yoff);
        dragging = true;
    },false);

    _("#toolmgr").addEventListener("mousemove", function (event){
        if(!dragging)return;
        _("#toolmgr").style.left = (event.pageX - xoff) + "px";
        _("#toolmgr").style.top = (event.pageY - yoff) + "px";
    }, false);

    _("#toolmgr").addEventListener("mouseup", function(event){
        dragging = false;
    },false);*/

    _("#toolmgr").addEventListener("touchstart", function (event){
        var touch = event.touches[0];
        event.preventDefault();
        vd = { x: _('#toolmgr').style.left, y: _('#toolmgr').style.top };
        xoff = touch.pageX - parseInt(_("#toolmgr").style.left);
        yoff = touch.pageY - parseInt(_("#toolmgr").style.top);
    },false);
    _("#toolmgr").addEventListener("touchmove", function (event){
        var touch = event.touches[0];
        _("#toolmgr").style.left = (touch.pageX - xoff) + "px";
        _("#toolmgr").style.top = (touch.pageY - yoff) + "px";
    }, false);
    _('#toolmgr').addEventListener('touchend', function(event){
        var touch = event.touches[0];
        var vd1 = { x: _('#toolmgr').style.left, y: _('#toolmgr').style.top };
        if(vd.x == vd1.x && vd.y == vd1.y)
        {
            // Hasn't moved
            
            Taskmgr.after( 600, "ShowOverlay", showDefaultOverlay);
        }
    }, false);

    //_('#toolmgr').onclick = function () { Overlay.show( new List().html() ); };

    orientationStuff();


    if(!window.navigator.onLine)
        alert("Warning!\n\nYou are offline.");

};

function showDefaultOverlay()
{
    var lst = new List();
            lst.width = "97%";
            lst.height = "110px";
            lst.on_click = "append_with_data";

            lst.newChild( "NavBar", "Navigation bar",  '{ "tagname":"div", "style": "' + __navbar__ + '" }' );
            lst.newChild( "Label", "Text Label", '{ "tagname":"span", "style": "'+ __label__ +'", "children": { "c1": { "tagname":"__text__", "text": "Label" } } }' );
            lst.newChild( "Image", "Image from url", '{ "tagname": "img", "style": "position: absolute; z-index:1; top:0px; left:0px; width:25%; height:25%;" }' );

            var group = new Element("DIV");

            cancelButton = new Element( "DIV" );
            cancelButton.set( "id", "cbtn2");
            cancelButton.set( "onclick", "Overlay.hide();");
            cancelButton.set("class", "topLeftCBtn");
            cancelButton.append( Element.newText( "X" ) );
            cancelButton.appendTo( group );

            var list = lst.html();
            list.set( "style", list.get("style") + "top: 35px;" );
            list.appendTo( group );

            Overlay.show_raw( group.html() );
}

function inspect(element)
{
    cel = element;
    inspector = _('#inspector');
    inspector.querySelector( "A" ).innerText = "Inspector - " + element.tagName + "#" + (element.id ? element.id : "null");
    var ps = [];
    ps.push( Property.button( "Remove Element", "cel.parentNode.removeChild(cel); hide_inspect();") );
    ps.push( Property.text( "id", element.id, "if(!exists(event.target.value)){ cel.id = event.target.value; }else { alert('That id is alreay given to another object'); event.target.value = ''; }" ) );
    switch( element.tagName )
    {
        case "DIV":
            ps.push( Property.label( "Div config", "black", "Arial", "12px" ) );
            ps.push( Property.text( "x", element.style.left, "cel.style.left = ensurePx('w', event.target.value);") );
            ps.push( Property.text( "y", element.style.top, "cel.style.top = ensurePx('h', event.target.value);") );
            ps.push( Property.text( "width", element.style.width, "cel.style.width = ensurePx('w', event.target.value);" ) );
            ps.push( Property.text( "height", element.style.height, "cel.style.height = ensurePx('h', event.target.value);" ) );
            ps.push( Property.text( "color", element.style.backgroundColor, "cel.style.backgroundColor = event.target.value") );
            ps.push( Property.text( "border", element.style.border, "cel.style.border = event.target.value;" ) );
            ps.push( Property.text( "Order", element.style.zIndex, "cel.style.zIndex = constrainZ(event.target.value);" ) );
            break;
        case "SPAN":
            ps.push( Property.label( "Span config", "black", "Arial", "12px" ) );
            ps.push( Property.text( "x", element.style.left, "cel.style.left = ensurePx('w', event.target.value);") );
            ps.push( Property.text( "y", element.style.top, "cel.style.top = ensurePx('h', event.target.value);") );
            ps.push( Property.text( "width", element.style.width, "cel.style.width = ensurePx('w', event.target.value);" ) );
            ps.push( Property.text( "height", element.style.height, "cel.style.height = ensurePx('h', event.target.value);" ) );
            ps.push( Property.text( "text", element.innerText, "cel.innerText = event.target.value;" ) );
            ps.push( Property.text( "font", element.style.fontFamily, "cel.style.fontFamily = event.target.value;" ) );
            ps.push( Property.text( "size", element.style.fontSize, "cel.style.fontSize = event.target.value;" ) );
            ps.push( Property.text( "color", element.style.color, "cel.style.color = event.target.value;" ) );
            ps.push( Property.text( "border", element.style.border, "cel.style.border = event.target.value;" ) );
            ps.push( Property.text( "Order", element.style.zIndex, "cel.style.zIndex = constrainZ(event.target.value);" ) );
            break;
        case "IMG":
            ps.push( Property.label( "Image config", "black", "Arial", "12px" ) );
            ps.push( Property.text( "x", element.style.left, "cel.style.left = ensurePx('w', event.target.value);") );
            ps.push( Property.text( "y", element.style.top, "cel.style.top = ensurePx('h', event.target.value);") );
            ps.push( Property.text( "width", element.style.width, "cel.style.width = ensurePx('w', event.target.value);" ) );
            ps.push( Property.text( "height", element.style.height, "cel.style.height = ensurePx('h', event.target.value);" ) );
            ps.push( Property.text( "URL", element.src, "cel.src = event.target.value;" ) );
            ps.push( Property.text( "border", element.style.border, "cel.style.border = event.target.value;" ) );
            ps.push( Property.text( "Order", element.style.zIndex, "cel.style.zIndex = constrainZ(event.target.value);" ) );
            break;
        default:
            ps.push( Property.label( "N/A", "red", "Arial", "15px" ) );
            break;
    }
    Properties( inspector, ps, "0px", "30px", "100%", "90%" );
    inspector.style.display = 'inline';
}

function hide_inspect()
{
    inspector.removeChild( inspector.childNodes[ inspector.childNodes.length-1 ] );
    inspector.style.display = "none";
}

function append_with_data( title, data, parent )
{
    parent = parent || getDefaultParent();
    var _data = JSON.parse( data );
    //alert(data);
    if(title == "__text__")
   {
       if(parent.constructor == Element)
            parent.append( Element.newText( _data.text ) );
        else
            parent.appendChild(Element.newText( _data.text ));
        if(_('#overlay'))Overlay.hide();
        return;
   }
   else
   {
        var foo = new Element( _data.tagname );
        var dat = new Element( "DATA" );
        foo.set( "style", _data.style );
        foo.set("ontouchstart", "event.preventDefault(); xoff = event.touches[0].pageX - parseInt(event.target.style.left); yoff = event.touches[0].pageY - parseInt(event.target.style.top); Overlay.show( Element.newText( '" + title + " selected!' ) ); Taskmgr.after( 600, 'Hide', function() { Overlay.hide(); }); var x = event.target; Taskmgr.after( 1200, event.target.toString(), function() { inspect(x); } );");
        foo.set("ontouchmove", "event.preventDefault(); var t = event.touches[0]; event.target.style.left = (t.pageX - xoff)+ 'px'; event.target.style.top = (t.pageY-yoff) + 'px'; Taskmgr.stop( event.target.toString() );");
        foo.set("ontouchend", "event.preventDefault(); Taskmgr.stop( event.target.toString() );");
   }
    if(_data.children)
    {
        for(c in _data.children)
            append_with_data( _data.children[c].tagname, JSON.stringify( _data.children[c] ), foo );
    }
    
    foo.appendTo( parent );
    if(_('#overlay'))Overlay.hide();
};

function orientationStuff()
{
    if(window.orientation == 0 || window.orientation == 180)
    {                                       // Portrait
        if(_('#overlay')){
            _('#overlay').style.left = "20%";
            _('#overlay').style.width = "60%";
            _("#overlay").style.top = "40%";
            _('#overlay').style.height = '20%';
        }
        _("#editor").style.top = "5%";
        _("#editor").style.height = "93.5%";
        _("#editor").style.width = "98%";

    }
    else
    {                                       // Landscape
        if(_('#overlay')){
            _('#overlay').style.left = "30%";
            _('#overlay').style.width = "40%";
            _("#overlay").style.top = "30%";
            _('#overlay').style.height = '40%';
        }

        _('#editor').style.top = "10%";
        _("#editor").style.height = "88%";
        _('#editor').style.width = "99%";
    }
}

window.addEventListener('orientationchange', function(event){
    _('#toolmgr').style.left = "10px";
    _("#toolmgr").style.top = "10px";


    orientationStuff();

}, false);

var Overlay = {
    show : function (content)
    {
        if(_('#overlay'))this.hide();
        var overlay = new Element( "DIV" );
        var cont = new Element( "DIV" );
            cont.set("class", "overlay-content");
            cont.append( content );
        overlay.append( cont );
        overlay.set("class", "centered-overlay");
        overlay.set("id", "overlay");
        overlay.appendTo( document.body );
        orientationStuff();
    },
    show_raw: function ( content )
    {
        if(_('#overlay'))this.hide();
        var overlay = new Element( "DIV" );
        overlay.append( content );
        overlay.set("class", "centered-overlay");
        overlay.set("id", "overlay");
        overlay.appendTo( document.body );
        orientationStuff();
    },
    hide : function ()
    {
        if(_('#overlay'))
            document.body.removeChild( _('#overlay') );
    }
}