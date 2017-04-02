

function Element( tag ){

    this.tag = tag;
    this.attribs = {};
    this.children = [];

}

Element.prototype.set = function ( attrib, value )
{
    this.attribs[attrib] = value;
};

Element.prototype.get = function ( attrib )
{
    return this.attribs[attrib] ? this.attribs[attrib] : null;
};

Element.prototype.rem = function ( attrib )
{
    if(this.attribs[attrib])delete this.attribs[attrib];
};

Element.prototype.html = function ()
{
    if(!this.tag)throw 'You need to specify a tag first';
    var foo = document.createElement(this.tag);
    for(a in this.attribs)
        foo.setAttribute(a, this.attribs[a]);
    for(var i = 0; i < this.children.length; i++)
        foo.appendChild( this.toHtml(this.children[i]) );
    return foo;
};

Element.prototype.toHtml = function ( el )
{
    if(!el)return null;
    else if(el.constructor == Element)
        return el.html();
    else
        return el;
};

Element.prototype.append = function ( child )
{
    this.children.push( child );
};

Element.prototype.appendTo = function ( parent )
{
    if(!parent)throw 'You need to specify a parent';
    else if(parent.constructor == Element)
    {
        parent.children.push( this );
    }
    else
    {
        parent.appendChild(this.html());
    }
};

Element.prototype.insertToBefore = function ( parent, noi, child )
{
    if(!parent)throw 'You need to specify a parent';
    child = child ? child : this;
    if(parent.constructor == Element)
    {
        if(noi.constructor == Number)
            {
                var buff = parent.children.splice(noi, parent.children.length-noi+1);
                parent.children = parent.children.concat( [ child ] ).concat( buff );
            }
        else
            {
                for( var i = 0; i < parent.children.length; i++ )
                    if(parent.children[i] == noi)this.insertBefore( parent, i, child );
            }
    }
    else
    {
        if(noi.constructor == Number)
            {
                this.insertBefore( parent, parent.children[noi], child );
            }
        else
            {
                parent.insertBefore(this.toHtml( child ), noi);
            }
    }
};

Element.prototype.insertBefore = function ( child, noi )
{
    this.insertToBefore( this, noi, child );
};

Element.newText = function ( text )
{
    return document.createTextNode( text );
};

const _ = function (selector){
    if(!selector || selector.constructor != String)return null;
    else if( selector.startsWith( "#" ) )
    {
        return document.getElementById( selector.substring(1) );
    }
    else if ( selector.startsWith(".") )
    {
        return document.getElementsByClassName( selector.substring(1) );
    }
    else
        return document.getElementsByTagName( selector );
};

var Taskmgr = {
    tasks : {},
    every : function ( ms, name, callback )
    {
        if(!ms || !name || name == "" || !callback)throw 'Some arguments are invalid\nExpected "Number, String, Function"';
        if(this.tasks[name])
            this.stop(name);
        this.tasks[name] = { uid : setInterval( callback, ms ), type: 'i' };
    },
    after : function ( ms, name, callback )
    {
        if(!ms || !name || name == "" || !callback)throw 'Some arguments are invalid\nExpected "Number, String, Function"';
        if(this.tasks[name])
            this.stop(name);
        this.tasks[name] = { uid : setTimeout( function() { Taskmgr.remove(name); callback(); }, ms ), type: 't' };
    },
    stop : function ( name )
    {
        if(this.tasks[name])
            if(this.tasks[name].type == 'i')
               {
                   clearInterval( this.tasks[name].uid );
                   delete this.tasks[name];
               } 
            else if(this.tasks[name].type == 't')
                {
                    clearTimeout( this.tasks[name].uid );
                    delete this.tasks[name];
                }
    },
    remove : function ( name )      // Only call, if timeout or interval has already been stopped, but not removed
    {
        if(this.tasks[name])
            delete this.tasks[name];
    }
};

function List()
{
    this.width = "100%";
    this.height = "500px";
    this.children = [];
    this.on_click = "console.log";
}

List.prototype.html = function()
{
    var root = new Element( "DIV" );
    root.set("class", "mono_list");
    root.set("ontouchstart", "dragging = true; event.preventDefault();");
    root.set("ontouchend", "dragging = false;");
    root.set("style", "width:" + this.width + "; height:" + this.height + ";");
    var el;
    for( var i = 0; i < this.children.length; i++ ) // { title: String, description: String, data: JSON }
        {
            el = this.children[i];
            var cell = new Element( "DIV" );
                var title = new Element("A");
                title.set("class", "bold mono_content");
                title.append( Element.newText( el.title ) );
                title.appendTo( cell );

                var description = new Element("P");
                description.set("class", "mono_content");
                description.append( Element.newText( el.description ) );
                description.appendTo( cell );

                var data = new Element("DATA");
                data.append( Element.newText( el.data ) );
                data.appendTo( cell );

            cell.set("class", "mono_cell");
            cell.set("onclick", this.on_click + "(event.target.tagName == 'DIV' ? event.target.querySelector('A').innerText : event.target.parentNode.querySelector('A').innerText, event.target.tagName == 'DIV' ? event.target.querySelector('DATA').innerText : event.target.parentNode.querySelector('DATA').innerText)");
            cell.appendTo( root );

        }
    return root;
};

List.prototype.newChild = function ( title, desc, data )
{
    this.children.push( { title: title, description: desc, data: data } );
};


function ensurePx(what, str)
{
    if(str.endsWith("px"))return str;
    else if(!str.endsWith("px") && !str.endsWith("%"))return str + "px";
    if(what == 'w')
        // 100% = window.innerWidth str% = x
        return ( parseInt(str) * window.innerWidth / 100 ) + "px";
    else if(what == 'h')
        return ( parseInt(str) * window.innerHeight / 100 ) + "px";

}

function constrainZ( str )
{
    var f = parseInt(str+"");
    if(str >= 100)return 99;
    else if(str < 0)return 0;
    return str;
}

function exists( id )
{
    if(_('#' + id) != null)return true;
    return false;
}

// Properties -- For inspector

function Properties( parent, properties, x, y, w, h )
{
    var list = new Element( "DIV" );
        for(var i = 0; i < properties.length; i++)
            {
                properties[i].appendTo( list );
            }
    list.set( "style", "position:absolute; top:" + y + "; left:" + x + ";width:" + w + "; height:" + h + ";" );
    list.appendTo( parent );
}

var Property = {

    label: function (text, color, font, size)
        {
            var foo = new Element( "SPAN" );
            foo.set ( "style", "position:relative; margin-top: 5px; margin-bottom: 5px; width:100%; color:" + color + "; font-family:" + font + "; font-size:" + size + ";" );
            foo.append( Element.newText( text ) );
            return foo;
        },
    button: function (text, action)
        {
            var foo = new Element( "BUTTON" );
            foo.set( "style", "position:relative; margin-top: 5px; border:0.5px solid gray; border-radius:10px; margin-bottom: 5px; width:99%;" );
            foo.set( "onclick", action );
            foo.append( Element.newText( text ) );
            return foo;
        },
    text: function ( placeholder, text, action )
        {
            var foo = new Element( "INPUT" );
            foo.set( "style", "position:relative; border: 0px; border-radius:10px; margin-top: 5px; margin-bottom: 5px; width:96%;" );
            foo.set( "type", "text" );
            foo.set( "placeholder", placeholder );
            foo.set( "onchange", action );
            foo.set( "value", text );
            return foo;
        },
    select: function ( options, action )
        {
            var foo = new Element( "SELECT" );
            var o = null;
            foo.set( "onchange", action );
            foo.set( "style", "position:relative; margin-top: 5px; margin-bottom: 5px; width:100%;" );
                for(var i = 0; i < options.length; i++)
                {
                    o = new Element( "OPTION" );
                    o.append( Element.newText( options[i] ) );
                    o.appendTo( foo );
                }
            return foo;
        }

};


// END




var __parent__ = document.body;

function getDefaultParent(){ return __parent__; }


var __navbar__ = "position: absolute; top: 0%; left: 0%; width: 100%; height: 44px; background-color: lightgray; z-index:1;";
var __label__ = "position: absolute; top:0%; left:0%; width:100px; height:30px; color: black; font-family: Arial; font-size: 12px; z-index: 1;";