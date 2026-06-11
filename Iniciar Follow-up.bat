@echo off
title Passo a Passo - Follow-up de Vendas
cd /d "%~dp0"

echo.
echo  Passo a Passo - Follow-up de Vendas
echo  =====================================
echo.

REM Verifica se ANTHROPIC_API_KEY esta definida
if "%ANTHROPIC_API_KEY%"=="" (
  echo  DICA: Para extracao automatica de PDFs, defina a chave:
  echo    set ANTHROPIC_API_KEY=sk-ant-...
  echo.
)

echo  Iniciando servidor em http://localhost:3737 ...
echo  Pressione Ctrl+C para encerrar.
echo.

start "" "http://localhost:3737"
node serve-followup.mjs
pause
