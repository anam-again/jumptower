@ECHO OFF
IF %1==0 (
    echo "LOBBY"
    set PLACE_ID=125910820416738
    set FILE_NAME=floodspore.lobby
) ELSE IF %1==1 (
    echo "SANDY"
    set PLACE_ID=100020441650754
    set FILE_NAME=floodspore.sandy
) ELSE IF %1==2 (
    echo "SPACETEST"
    set PLACE_ID=114245918015298
    set FILE_NAME=floodspore.spacetest
) ELSE (
    echo "No valid place"
    echo %1
    exit /b -1
)

set /p API_KEY=<./secrets/APIKEY.txt

echo "PLACE_ID: %PLACE_ID%"
echo "FILE_NAME: %FILE_NAME%"
echo "Type y to confirm publishing"

set /p RESP=
IF NOT %RESP%==y (
    echo "Aborting"
    exit /b -1
)
rbxcloud experience publish ^
--api-key %API_KEY% ^
--universe-id 6655214378 ^
--place-id %PLACE_ID% ^
--filename ../assets/%FILE_NAME%.rbxl ^
--version-type published