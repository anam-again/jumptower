@ECHO OFF
IF %1==0 (
    echo "Tower"
) ELSE (
    echo "No valid place"
    echo %1
    exit /b -1
)

echo Building: %1
echo %1 > ../src/shared/PLACE.txt