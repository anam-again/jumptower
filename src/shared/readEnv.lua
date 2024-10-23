local globals = {}

local place = script.Parent.PLACE.Value

if (not place) then
    error('No PLACE value present in src/shared/PLACE.txt')
end

globals.Place = place;

return globals;