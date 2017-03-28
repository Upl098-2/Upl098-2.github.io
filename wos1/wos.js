
var wos = {

    quit: function()
    {
        pause();
        clear();
        fill("white");
        text("[ " + dtf() + " ]: WOS Kernel: Halt!", 0, 10, "12px Arial", FILL);
    },

    xoff: 0,
    yoff: 0,
    dragging: false,

    draw: function ()
    {
        Desktop.draw();
        
        for(var i = 0; i < this.windows.length; i++)
        {
            var c = this.windows[i];
            FRAME(c.x, c.y, c.w, c.h, c.title, false);
            
            c.handle.update( c.x, c.y+15, c );
        }

        if(this.active){ FRAME(this.active.x, this.active.y, this.active.w, this.active.h, this.active.title, true); this.active.handle.update(this.active.x, this.active.y+15, this.active); }

        Desktop.taskbar();
    },
    windows:
    [

    ],
    active: null,
    
    push_new_window: function( x, y, w, h, t, handle )
    {
        if(this.active)
        {
            this.windows.push( this.active );
        }
        this.active = { x: x, y: y, w: w, h: h, title: t, handle: handle };
        return this.active;
    },
    request_start_application: function ( handle, name )
    {
        handle.init( Taskmgr.start( handle, name ) );
    },

    remove_handle: function ( handle )
    {
        if(this.active && this.active.handle == handle)this.active = null;
        var i;
        while((i = this.handle_index(handle)) != -1)this.windows.splice(i,1);
        return;
    },

    handle_index: function ( handle )
    {
        for(var i = 0; i < this.windows.length; i++)
        {
            if(this.windows[i].handle == handle)return i;
        }
        return -1;
    },

    key_up: function( key, event )
    {
        if(this.active && this.active.handle.key_up)
        {
            this.active.handle.key_up(key, event);
        }
    },

    key_down: function( key, event )
    {
        if(this.active && this.active.handle.key_down)
        {
            this.active.handle.key_down(key, event);
        }
    },

    click_action: function (x, y)
    {
        this.dragging = false;

        //Check If taskbar
        if(Desktop.click_action_taskbar(x, y))return;

        //If clicked in active window
        var win = this.active;
        if(win && x >= win.x && x <= win.x + win.w && y >= win.y && y <= win.y + win.h)
            {
                //If clicked on (Close)
                if(inradius(win.x + 7.5, win.y + 7.5, 3.75, x, y))
                    {
                        this.active.handle.window_closed( this.active );
                        return;
                    }
                else if(y >= win.y + 15)
                {
                    //If clicked inside the main frame
                    //Pass x, y to callback function
                    win.handle.callback(MOUSE.LEFT, x - win.x, y - win.y + 15, win);
                }

                    return;
            }
        for(var i = this.windows.length-1; i >= 0; i--)
        {
            win = this.windows[i];
            //If clicked in passive window
            if(x >= win.x && x <= win.x + win.w && y >= win.y && y <= win.y + win.h)
            {
                if(this.active)this.windows.push(this.active);
                this.active = this.windows.splice(i, 1)[0];
                return;
            }
        }
        //If clicked on Desktop
        //TODO: add actions for Desktop
        if(this.active){
            this.windows.push(this.active);
            this.active = null;
        }
        //If clicked on DesktopIcon
        Desktop.click_action(x,y);
    },
    ldown_action: function (x, y){
        var win = this.active;
        if(win && x >= win.x && x <= win.x + win.w && y >= win.y && y <= win.y + win.h)
            {
                //If in frame bar
                if(y < win.y + 15)
                {
                    this.dragging = true;
                    this.xoff = x - win.x;
                    this.yoff = y - win.y;
                    return;    
                }
                else win.handle.callback(MOUSE.LEFTDOWN, x - win.x, y - win.y + 15, win);
                return;
            }
    },
    move_action: function (x, y){
        var win = this.active;
        if(win && this.dragging)
        {
            win.x = x - this.xoff;
            win.y = y - this.yoff;
        }else if(win)
        {
            if(y >= win.y+15){
                win.handle.callback( MOUSE.MOVE, x - win.x, y - win.y + 15, win );
            }
        }
    }
}

var Taskmgr = {
    tasklist: [],
    next_pid: 0,
    get_active_tasks: function()
    {
        var sb = "";
        for(var i = 0; i < this.tasklist.length; i++)
            sb += this.tasklist[i].pid + ": " + this.tasklist[i].name + "\n";
        return sb;
    },
    start: function( handle, name ){ if(this.tasklist.length == 0)this.next_pid = 0; this.tasklist.push( { pid: this.next_pid++, name: name, handle: handle } ); return this.next_pid-1; },
    stop: function ( pid )
    {
        for(var i = 0; i < this.tasklist.length; i++)
        {
            if(this.tasklist[i].pid == pid)
            {
                wos.remove_handle( this.tasklist[i].handle );
                this.tasklist.splice(i, 1);
                return "Success!";
            }
        }
        return "Couldn't find process with pid: "+pid;
    }
};

var Desktop = {
    draw: function ()
    {
        for(var i = 0; i < this.icons.length; i++)
        {
            this.icons[i].draw(this.icons[i].x, this.icons[i].y);
        }
    },
    
    click_action: function(x,y)
    {
        var c = null;
        for(var i = 0; i < this.icons.length; i++)
        {
            c = this.icons[i];
            if(x >= c.x && x <= c.x+60 && y >= c.y && y <= c.y+60)
                {
                    c.start_attached_application();
                }
        }
    },

    click_action_taskbar: function(x,y)
    {
        if( y >= height-34 )
        {

            // Test if clicked on start button
            if(x >= 2 && x <= 52)
            {
                wos.request_start_application( new shutdownmgr.App() );
            }

            return true;
        }
        return false;
    },

    icons:
    [
        {
            draw: function( _x, _y)
            {
                ICON( _x, _y, function (x, y) { fill("black"); stroke("lightgray"); rect(x, y+5, 51, 31, FILL); rect(x, y+5, 51, 31, STROKE); fill("white"); text(">_", x+5, y+20, "15px Arial", FILL); return [ x, y+65 ]; }, "Terminal", "white", 0 );
            },
            start_attached_application: function()
            {
                var foo = new terminal.App();
                wos.request_start_application( foo, "Terminal" );
            },
            x: 10,
            y: 10
        },
        {
            draw: function( _x, _y)
            {
                ICON( _x, _y, function (x, y) { fill("black"); stroke("lightgray"); rect(x, y+5, 51, 31, FILL); rect(x, y+5, 51, 31, STROKE); fill("white"); text(">_", x+5, y+20, "15px Arial", FILL); return [ x, y+65 ]; }, "Test", "white", 13 );
            },
            start_attached_application: function()
            {
                var foo = new test.App();
                wos.request_start_application( foo, "Test" );
            },
            x: 80,
            y: 10
        }
    ],

    taskbar: function()
    {
        fill("lightgray");
        rect(0, height-34, width, 34, FILL);
        stroke("gray");
        rect(2, height-32, 50, 30, STROKE);
        fill("black");
        text("Start", 9, height-13, "12px Monospace", FILL);
    }
};

function ICON(x, y, iccallback, txt, tc, to)
{
    to = to ? to : 0;
    var nxy = iccallback(x, y);
    fill(tc);
    text( txt, nxy[0]+to, nxy[1], "12px Arial", FILL);
}

function FRAME(x, y, w, h, title, active)
{
    stroke("black");
    rect(x,y,w,h,STROKE);
    if(active)
    {
        fill("lightgray");
        rect(x, y, w, 15, FILL);
        fill("red");
        circle(x+7.5,y+7.5, 3.75, FILL);
        fill("black");
        text(title, x+13, y+11, "12px Monospace", FILL);
        fill("white");
        rect(x, y+15, w, h-15, FILL);
    }else
    {
        fill("gray");
        rect(x, y, w, 15, FILL);
        fill("lightgray");
        circle(x+7.5,y+7.5, 3.75, FILL);
        fill("black");
        text(title, x+13, y+11, "12px Monospace", FILL);
        fill("white");
        rect(x, y+15, w, h-15, FILL);
    }
}

function inradius(mx, my, r, x, y)
{
    var a = x - mx;
    var b = y - my;
    var c = Math.sqrt( Math.pow( a ,2) + Math.pow( b ,2) );
    return c <= r;
}
/*

        .[mx, my]
        |\
  [y-my]| \
        +--. [x, y]
        [ x-mx ]
*/