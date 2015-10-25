@ECHO OFF
:BEGIN
CLS
SET /P BuildMethod=Select build method: 1(default) public, 2 public+private:
REM - THE NEXT THREE LINES ARE DIRECTING USER DEPENDING UPON INPUT
IF /I '%BuildMethod%'=='' GOTO ONE
IF /I '%BuildMethod%'=='1' GOTO ONE
IF /I '%BuildMethod%'=='2' GOTO TWO
IF /I '%BuildMethod%'=='3' GOTO THREE

GOTO END
:THREE
ECHO Testing Template
java -jar jsrun.jar C:\Rendition\Docs\Rendition.Documentation\jsdoc_toolkit\app\run.js -p -n -r=3 -E=jquery -d=C:\Rendition\Docs\Rendition.Documentation\toc\js -t=C:\Rendition\Docs\Rendition.Documentation\jsdoc_toolkit\templates\vsaml c:\Rendition\Rendition.Core\js\admin\ui\grid.js
GOTO END

:TWO
ECHO Building public + private
java -jar jsrun.jar C:\Rendition\Docs\Rendition.Documentation\jsdoc_toolkit\app\run.js -p -n -r=3 -E=jquery -d=C:\Rendition\Docs\Rendition.Documentation\toc\js -t=C:\Rendition\Docs\Rendition.Documentation\jsdoc_toolkit\templates\vsaml c:\Rendition\Rendition.Core\js\admin\ c:\Rendition\Rendition.Core\js\admin\pub\
GOTO END
:ONE
ECHO Building public only
java -jar jsrun.jar C:\Rendition\Docs\Rendition.Documentation\jsdoc_toolkit\app\run.js -n -r=3 -E=jquery -d=C:\Rendition\Docs\Rendition.Documentation\toc\js -t=C:\Rendition\Docs\Rendition.Documentation\jsdoc_toolkit\templates\vsaml c:\Rendition\Rendition.Core\js\admin\ c:\Rendition\Rendition.Core\js\admin\pub\
:END


