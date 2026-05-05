@echo off
set BASE=docs\Stats
set SCRIPT=apps\client\parse_lua.py

for /d %%F in (%BASE%\*) do (
    set FOLDER=%%~nxF
    echo Parsing %%~nxF...
    python %SCRIPT% --input "%%F" --output "%BASE%\%%~nxF.json" --faction "%%~nxF"
)
echo.
echo Done! All factions parsed.