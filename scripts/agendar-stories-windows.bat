@echo off
:: ============================================================
:: Agendador de Stories Diários — Passo a Passo Uniformes
:: Registra tarefa no Agendador de Tarefas do Windows
:: Execute este arquivo como ADMINISTRADOR (botão direito → Executar como administrador)
:: ============================================================

SET PROJECT_DIR=C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso
SET NODE_EXE=C:\Program Files\nodejs\node.exe
SET SCRIPT="%PROJECT_DIR%\scripts\daily-stories.js"
SET TASK_NAME=PassoaPasso_Stories_Diarios

echo.
echo ==================================================
echo  Passo a Passo Uniformes — Agendador de Stories
echo ==================================================
echo.

:: Remove tarefa existente (se houver)
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1

:: Cria a tarefa: executa daily-stories.js todos os dias às 07:00
schtasks /create ^
  /tn "%TASK_NAME%" ^
  /tr "\"%NODE_EXE%\" %SCRIPT%" ^
  /sc DAILY ^
  /st 07:00 ^
  /sd 01/01/2026 ^
  /ru "%USERNAME%" ^
  /rl HIGHEST ^
  /f

IF %ERRORLEVEL% EQU 0 (
  echo.
  echo  ✅ TAREFA AGENDADA COM SUCESSO!
  echo  Nome: %TASK_NAME%
  echo  Horário: todos os dias às 07:00
  echo  Script: %SCRIPT%
  echo.
  echo  O cronograma de stories chegará ao email
  echo  passoapassouniformes2025@gmail.com às 7h.
) ELSE (
  echo.
  echo  ❌ ERRO ao agendar. Execute como Administrador.
)

echo.
echo  Para verificar: Agendador de Tarefas → %TASK_NAME%
echo  Para testar agora: npm run stories
echo.
pause
