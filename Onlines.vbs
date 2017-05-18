set objIE=CreateObject("InternetExplorer.Application")

objIE.Navigate "http://upl098.github.io/quick.html"
objIE.Toolbar = False
objIE.StatusBar = False
objIE.MenuBar = False
objIE.Visible = True
