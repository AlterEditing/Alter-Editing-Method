!include "LogicLib.nsh"
!include "WordFunc.nsh"

!macro customInit
  StrCpy $0 ""

  ReadRegStr $0 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "DisplayVersion"
  ${If} $0 == ""
    ReadRegStr $0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "DisplayVersion"
  ${EndIf}

  ${If} $0 != ""
    ${VersionCompare} $0 "${VERSION}" $1

    ${If} $1 == 0
      MessageBox MB_OK|MB_ICONINFORMATION "AlterEditingMethod $0 is already installed."
      Abort
    ${EndIf}
  ${EndIf}
!macroend
