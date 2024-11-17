@ECHO OFF
IF %1==0 (
    echo "Tower"
    set PLACE_ID=1111
    set FILE_NAME=jumptower.tower
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
@REM rbxcloud experience publish ^
@REM --api-key %API_KEY% ^
@REM --universe-id 6655214378 ^
@REM --place-id %PLACE_ID% ^
@REM --filename ../assets/%FILE_NAME%.rbxl ^
@REM --version-type published