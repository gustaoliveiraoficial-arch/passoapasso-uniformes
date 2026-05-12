Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
}
"@
Add-Type -AssemblyName System.Windows.Forms

$scriptPath = "C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\painel-vendas-comercial\google-apps-script.gs"
$scriptCode = [System.IO.File]::ReadAllText($scriptPath, [System.Text.Encoding]::UTF8)
$spreadsheetId = "1-SLpaeXztHabC58_6a9nZESUKHldTCb0ZwfTf-3odVc"

function BringChromeToFront {
    $procs = Get-Process -Name "chrome" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }
    if ($procs) {
        $proc = $procs | Select-Object -First 1
        [Win32]::ShowWindow($proc.MainWindowHandle, 9) | Out-Null
        [Win32]::SetForegroundWindow($proc.MainWindowHandle) | Out-Null
        Start-Sleep -Milliseconds 500
        return $true
    }
    return $false
}

function TypeInAddressBar($url) {
    [System.Windows.Forms.SendKeys]::SendWait("^l")
    Start-Sleep -Milliseconds 500
    [System.Windows.Forms.SendKeys]::SendWait("^a")
    Start-Sleep -Milliseconds 200
    [System.Windows.Forms.Clipboard]::SetText($url)
    [System.Windows.Forms.SendKeys]::SendWait("^v")
    Start-Sleep -Milliseconds 300
    [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
}

Write-Host "=== AUTOMAÇÃO APPS SCRIPT ==="

# 1. Traz Chrome para frente
Write-Host "[1] Ativando Chrome..."
BringChromeToFront | Out-Null
Start-Sleep -Seconds 1

# 2. Navega para a planilha em nova aba
Write-Host "[2] Abrindo planilha..."
[System.Windows.Forms.SendKeys]::SendWait("^t")
Start-Sleep -Milliseconds 800
TypeInAddressBar("https://docs.google.com/spreadsheets/d/$spreadsheetId/edit")
Write-Host "    Aguardando carregar (8s)..."
Start-Sleep -Seconds 8

# 3. Abre Extensões > Apps Script
Write-Host "[3] Abrindo Extensões > Apps Script..."
BringChromeToFront | Out-Null

# Usa o atalho de menu: Alt abre a barra de menus no Chrome
# Na planilha: Extensões está na posição 6 (arquivo=1, editar=2, ver=3, inserir=4, formatar=5, dados=6... espera, varia)
# Melhor: navega para a URL do Apps Script direto via address bar depois de identificar o script ID

# Clica em Extensões usando JavaScript injection via console
# Abre o DevTools console com F12
[System.Windows.Forms.SendKeys]::SendWait("{F12}")
Start-Sleep -Seconds 2

# Vai para o console
[System.Windows.Forms.SendKeys]::SendWait("^`")  # Ctrl+` abre console no DevTools
Start-Sleep -Milliseconds 500

# Injeta JavaScript para clicar em Extensões > Apps Script
$js = @"
(function(){
  var menus = document.querySelectorAll('[role="menubar"] [role="menuitem"]');
  for(var m of menus){ if(m.textContent.includes('Exten')){ m.click(); break; } }
  setTimeout(function(){
    var items = document.querySelectorAll('[role="menuitem"]');
    for(var i of items){ if(i.textContent.includes('Apps Script')){ i.click(); break; } }
  }, 1000);
})()
"@

[System.Windows.Forms.Clipboard]::SetText($js)
[System.Windows.Forms.SendKeys]::SendWait("^v")
Start-Sleep -Milliseconds 300
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Write-Host "    JS injetado, aguardando Apps Script abrir (8s)..."
Start-Sleep -Seconds 3

# Fecha DevTools
[System.Windows.Forms.SendKeys]::SendWait("{F12}")
Start-Sleep -Seconds 5

Write-Host "[4] Procurando aba do Apps Script..."
Start-Sleep -Seconds 3

# Tenta navegar para a aba do Apps Script com Ctrl+Tab
# Normalmente abre em nova aba
[System.Windows.Forms.SendKeys]::SendWait("^{TAB}")
Start-Sleep -Seconds 2

# Verifica se a aba atual é do Apps Script
# Copia a URL da address bar
[System.Windows.Forms.SendKeys]::SendWait("^l")
Start-Sleep -Milliseconds 300
[System.Windows.Forms.SendKeys]::SendWait("^c")
Start-Sleep -Milliseconds 300
[System.Windows.Forms.SendKeys]::SendWait("{ESCAPE}")
$currentUrl = [System.Windows.Forms.Clipboard]::GetText()
Write-Host "    URL atual: $currentUrl"

if ($currentUrl -notlike "*script.google.com*") {
    Write-Host "    Não é Apps Script. Tentando navegar diretamente..."
    BringChromeToFront | Out-Null
    [System.Windows.Forms.SendKeys]::SendWait("^t")
    Start-Sleep -Milliseconds 800
    TypeInAddressBar("https://script.google.com/home")
    Start-Sleep -Seconds 5

    # Copia URL para verificar
    [System.Windows.Forms.SendKeys]::SendWait("^l")
    Start-Sleep -Milliseconds 300
    [System.Windows.Forms.SendKeys]::SendWait("^c")
    Start-Sleep -Milliseconds 300
    [System.Windows.Forms.SendKeys]::SendWait("{ESCAPE}")
    $currentUrl = [System.Windows.Forms.Clipboard]::GetText()
    Write-Host "    URL após navegação: $currentUrl"
}

Write-Host "[5] Colando código no editor..."
# Assume que está na aba correta do Apps Script
# Clica na área de código (aproximadamente centro da tela)
$screenWidth = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width
$screenHeight = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height
$centerX = $screenWidth / 2
$centerY = $screenHeight / 2

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class MouseOps {
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
    [DllImport("user32.dll")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint cButtons, uint dwExtraInfo);
    public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    public const uint MOUSEEVENTF_LEFTUP = 0x0004;
    public static void Click(int x, int y) {
        SetCursorPos(x, y);
        mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
        System.Threading.Thread.Sleep(100);
        mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
    }
}
"@

BringChromeToFront | Out-Null
[MouseOps]::Click($centerX, $centerY)
Start-Sleep -Milliseconds 500

# Seleciona tudo e substitui
[System.Windows.Forms.SendKeys]::SendWait("^a")
Start-Sleep -Milliseconds 300
[System.Windows.Forms.Clipboard]::SetText($scriptCode)
[System.Windows.Forms.SendKeys]::SendWait("^v")
Write-Host "    Código colado!"
Start-Sleep -Seconds 2

# Salva
[System.Windows.Forms.SendKeys]::SendWait("^s")
Write-Host "[6] Salvo!"
Start-Sleep -Seconds 3

Write-Host "=== PRONTO ==="
Write-Host "Agora clique em 'Implantar' > 'Nova implantação' manualmente no Chrome"
Write-Host "Tipo: Aplicativo da Web | Acesso: Qualquer pessoa"
Write-Host "Depois me manda a URL gerada"
