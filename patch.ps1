$in = Read-Host "Введите путь к mp4 файлу"

$out = [System.IO.Path]::ChangeExtension($in, "_patched.mp4")

$b = [System.IO.File]::ReadAllBytes($in)

for ($i = 0; $i -lt $b.Length - 12; $i++) {
    if ($b[$i] -eq 0x65 -and $b[$i+1] -eq 0x6C -and $b[$i+2] -eq 0x73 -and $b[$i+3] -eq 0x74) {

        if ($b[$i+4] -eq 0 -and $b[$i+5] -eq 0 -and $b[$i+6] -eq 0 -and $b[$i+7] -eq 0) {

            $b[$i+8] = 0x10
            $b[$i+9] = 0x00
            $b[$i+10] = 0x00
            $b[$i+11] = 0x01

            break
        }
    }
}

[System.IO.File]::WriteAllBytes($out, $b)

Write-Host "Готово: $out"
pause