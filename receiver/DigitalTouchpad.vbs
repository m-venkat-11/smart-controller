' DIGITAL TOUCHPAD — SILENT DESKTOP LAUNCHER
' Launches the Digital Touchpad Receiver without opening any command prompt or terminal window.

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

strAppDir = fso.GetParentFolderName(WScript.ScriptFullName)
strPsScript = strAppDir & "\DigitalTouchpadApp.ps1"

' If launched from root
If Not fso.FileExists(strPsScript) Then
    strPsScript = strAppDir & "\receiver\DigitalTouchpadApp.ps1"
End If

strCommand = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & strPsScript & """"
WshShell.Run strCommand, 0, False
