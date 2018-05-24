local invoke = component.invoke

function boot_invoke(addr, method, ...)
    local result = table.pack(pcall(invoke, addr, method, ...))
    if not result[1] then
        return nil, result[2]
    else
        return table.unpack(result, 2, result.n)
    end
end

-- backwards compability, may remove later
local eeprom = component.list("eeprom")()
computer.getBootAddress = function()
    return boot_invoke(eeprom, "getData")
end

computer.setBootAddress = function(addr)
    return boot_invoke(eeprom, "setData", addr)
end

do
    local screen = component.list("screen")()
    local gpu = component.list("gpu")()
    local w, h
    if gpu and screen then
        boot_invoke(gpu, "bind", screen)
        component.invoke(gpu, "bind", screen)
        w, h = component.invoke(gpu, "maxResolution")
        component.invoke(gpu, "setResolution", w, h)
        component.invoke(gpu, "setBackground", 0x000000)
        component.invoke(gpu, "setForeground", 0xFFFFFF)
        component.invoke(gpu, "fill", 1, 1, w, h, " ")
    end
end

local y = 1
local function writeln( txt )
    if gpu and screen then
        component.invoke(gpu, "set", 1, y, txt)
        if y == h then
            component.invoke(gpu, "copy", 1, 2, w, h - 1, 0, -1)
            component.invoke(gpu, "fill", 1, h, w, 1, " ")
        else
            y = y + 1
        end
    end
end

local function loadaddr(addr)
    local handle, reason = boot_invoke(addr, "open", "/init.lua")
    if not handle then
        return nil, reason
    end
    local buffer = ""
    repeat
        local data, reason = boot_invoke(addr, "read", handle, math.huge)
        if not data and reason then
            return nil, reason
        end
        buffer = buffer .. (data or "")
    until not data
    boot_invoke(addr, "close", handle)
    return load(buffer, "=init")
end

writeln("Trying to find boot devices...")

local init, reason
if computer.getBootAddress() then
    writeln("Trying '" .. computer.getBootAddress() .. "'")
    init, reason = loadaddr(computer.getBootAddress())
end
if not init then
    computer.setBootAddress()
    for addr in component.list("filesystem") do
        writeln("Trying '" .. addr .. "'")
        init, reason = loadaddr(addr)
        if init then
            computer.setBootAddress(addr)
            break
        end
    end
end
if not init then
    error("no bootable medium found!")
end
computer.beep(1000,0.2)
writeln("not calling /init.lua ...")
--init()
writeln("quitting...")
local a
while true do
    a=0
end
    
