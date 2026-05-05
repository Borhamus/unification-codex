-- corsix_macro.lua
-- Run this in Corsix Mod Studio: right click on "attrib" folder → Run Macro
-- Output goes to OUTPUT_BASE\output.json
-- Change OUTPUT_BASE to match your repo path

local OUTPUT_BASE = "C:\\Users\\Administrator\\Desktop\\UNIFICATION RANKS\\unification-codex\\docs\\Stats\\Raw"
local results = {}

function g1(rgd, a)
    local ok, v = pcall(function() return rgd.GameData:GET(a) end)
    if ok then return v else return nil end
end
function g2(rgd, a, b)
    local ok, v = pcall(function() return rgd.GameData:GET(a, b) end)
    if ok then return v else return nil end
end
function g3(rgd, a, b, c)
    local ok, v = pcall(function() return rgd.GameData:GET(a, b, c) end)
    if ok then return v else return nil end
end
function g4(rgd, a, b, c, d)
    local ok, v = pcall(function() return rgd.GameData:GET(a, b, c, d) end)
    if ok then return v else return nil end
end

function each_file(rgd)
    if not rgd then return end
    if not rgd.GameData then return end
    local unit = {}
    unit.path        = rgd.path
    unit.hp          = g2(rgd, "health_ext", "hitpoints")
    unit.armour      = g2(rgd, "health_ext", "armour")
    unit.regen       = g2(rgd, "health_ext", "regeneration_rate")
    unit.req         = g4(rgd, "cost_ext", "time_cost", "cost", "requisition")
    unit.power       = g4(rgd, "cost_ext", "time_cost", "cost", "power")
    unit.pop         = g4(rgd, "cost_ext", "time_cost", "cost", "population")
    unit.build_time  = g3(rgd, "cost_ext", "time_cost", "time_seconds")
    unit.speed_max   = g2(rgd, "moving_ext", "speed_max")
    unit.sight       = g2(rgd, "sight_ext", "sight_radius")
    unit.max_range   = g1(rgd, "max_range")
    unit.damage      = g1(rgd, "damage")
    unit.reload_time = g1(rgd, "reload_time")
    unit.accuracy    = g1(rgd, "accuracy")
    unit.name_id     = g3(rgd, "ui_ext", "ui_info", "screen_name_id")
    unit.is_structure = (g1(rgd, "structure_ext") ~= nil or g1(rgd, "structure_buildable_ext") ~= nil)
    unit.is_builder   = (g1(rgd, "building_engineer_ext") ~= nil)
    unit.has_melee    = (g1(rgd, "melee_ext") ~= nil)
    results[#results + 1] = unit
end

function json_val(v)
    if type(v) == "boolean" then return tostring(v)
    elseif type(v) == "number" then return tostring(v)
    elseif v == nil then return "null"
    else return '"' .. tostring(v):gsub("\\", "\\\\"):gsub('"', '\\"') .. '"' end
end

function at_end()
    local lines = {"["}
    for i, unit in ipairs(results) do
        local fields = {}
        for k, v in pairs(unit) do
            if v ~= nil then
                fields[#fields + 1] = '"' .. k .. '":' .. json_val(v)
            end
        end
        lines[#lines + 1] = "  {" .. table.concat(fields, ",") .. "}" .. (i < #results and "," or "")
    end
    lines[#lines + 1] = "]"
    local f = io.open(OUTPUT_BASE .. "\\output.json", "w")
    if f then
        f:write(table.concat(lines, "\n"))
        f:close()
        print("Done! " .. #results .. " entries written.")
    else
        print("ERROR: cannot write file. Check OUTPUT_BASE path.")
    end
end