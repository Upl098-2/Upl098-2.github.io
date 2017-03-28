var activeWindow = false, closeWindow = true, dragging = false, posx = 50, posy = 50;
var xoff = 0;
var yoff = 0;

function start()
{
    frames(30);
    createCanvas(800, 600, "black", "0.5px solid green");
}

function update()
{
    clear();
    fill("green");
    rect(0,0,width,height,FILL);
    wos.draw();
}

function onKey(key, event)
{
    wos.key_up(key, event);
}

function onKDown(key, event)
{
    wos.key_down(key, event);
}

function onMouse(what, where, event)
{
    if(what == MOUSE.MOVE && where == canvas)
    {
        var x = event.pageX-10;
        var y = event.pageY-10;
        wos.move_action(x, y);    
    }else if(what == MOUSE.LEFTDOWN && where == canvas)
    {
        var x = event.pageX-10;
        var y = event.pageY-10;
        wos.ldown_action(x,y);
    }else if(what == MOUSE.LEFT && where == canvas)
    {
        dragging = false;
        var x = event.pageX-10;
        var y = event.pageY-10;
        wos.click_action(x, y);
    }
}

var shutdownmgr = {
    pid: null,
    App: function ()
    {
        this.init = function (pid)
        {
            if(shutdownmgr.pid != null){ Taskmgr.stop(pid); return; }
            shutdownmgr.pid = pid;
            wos.push_new_window( 0, height-84, 100, 50, "Shutdown", this);
        };
        this.update = function (x,y)
        {
            if(!wos.active || wos.active.handle != this)
                {
                    Taskmgr.stop ( shutdownmgr.pid );
                    shutdownmgr.pid = null;
                }
            fill("blue");
            text( "Shutdown", x+20, y+20, "12px Arial", FILL );
        };
        this.callback = function(t,x,y,s)
        {
            if(t == MOUSE.LEFT && x >= 20 && x <= 70 && y >= 41 && y <= 50)
            {
                wos.quit();
            }
        };
        this.window_closed = function ( win )
        {
            Taskmgr.stop ( shutdownmgr.pid );
            shutdownmgr.pid = null;
        };
    }.bind(null)

}; 

var terminal = {

    exec: function (handle, line)
    {
        if(line.trim() == "")return "";
        var cmd = line.trim().split(" ");
        switch(cmd[0])
        {
            case "help":
                return "There's no help\n";
            case "exit":
                if(handle)
                    Taskmgr.stop( handle.pid );
            case "clear":
                if(handle)
                    handle.text = "";
                return "";
            case "poweroff":
                wos.quit();
                return "";
            case "tasklst":
                return Taskmgr.get_active_tasks() + "\n";
            case "taskkill":
                if(cmd.length <= 1)return "Need an argument\n";
                return Taskmgr.stop( parseInt(cmd[1]+"") ) + "\n";
            default:
                return "ERR: '" + line + "' is not recognized as a valid command\n";
        }
    },

    App: function ()
    {

        this.pid = null;
        this.pwd = "(null)";
        this.text = "WOS Terminal Emulator (0.1a)\n\n" + this.pwd + "# ";
        this.text_len = 0;
        
        this.init = function (pid)
        {
            this.pid = pid;
            wos.push_new_window( 10, 10, 300, 215, "Terminal", this );
        };

        this.update = function (x, y)
        {
            fill("black");
            rect(x, y, 300, 200, FILL);
            fill("green");
            this.printf(this.text, x, y);
        };

        this.printf = function (s, _x, _y)
        {
            var sb = "";
            var c = "";
            var x = _x;
            var y = _y + 10;
            for(var i = 0; i < s.length; i++)
            {
                c = s.charAt(i);
                if(c == "\n")
                    {
                        fill("green");
                        text(sb, x, y, "12px Arial", FILL);
                        sb = "";
                        y += 10;
                        continue;
                    }
                else
                    {
                        sb += c;
                        continue;
                    }
            }
            if(sb != "")
                text(sb, x, y, "12px Arial", FILL);
        };

        this.callback = function (t,x,y,s)
        {

        };

        this.key_down = function(key, e)
        {
            //debugger;
            if(key == 16)return;
            if(key == 8 && this.text_len >= 1)
            {
                this.text = this.text.substring(0, this.text.length-1);
                this.text_len--;
                return;
            }else 
            {
                if(key >= 65 && key <= 90)  //Is ascii key
                    this.text += String.fromCharCode(event.shiftKey ? key : key+32);
                else if(key == 13)
                    {
                        // Execute command

                        out = terminal.exec ( this, this.text.substring( this.text.length - this.text_len ) );

                        this.text += "\n" + out + this.pwd + "# ";

                        this.text_len = 0;
                        return;
                    }
                else this.text += String.fromCharCode(key);

                this.text_len++;
            }
        };

        this.window_closed = function( win )
        {
            Taskmgr.stop( this.pid );
        };

    }

};

var test = {

    App: function ()
    {
        this.pid = null;
        this.win = null;
        this.c = 0;
        this.init = function (pid)
        {
            this.pid = pid;
            this.win = wos.push_new_window( 50, 50, 300, 200, "Test", this );
            return true;
        };
        this.update = function (x, y, s)
        {
            fill("green");
            var c = Math.floor(this.c / 3);
            var foo = "";
            for(var i = 0; i < c; i++)foo += test.str.charAt(i);
            text( foo, x, y+10, "12px Arial", FILL );
            if(s != this.win)return;
            if(c < test.str.length)this.c++;
        };
        this.window_closed = function( win )
        {
            wos.push_new_window( randint(0, width), randint(0, height), 300, 200, "Test", this );
            this.c = 0;
        };
        this.callback = function(t,x,y)
        {
        };
    }.bind(null),
    str: "Hello World!!!!!"
};