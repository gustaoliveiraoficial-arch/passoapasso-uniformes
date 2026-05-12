@echo off
echo ============================================
echo   DEPLOY NOTIFICACOES PUSH - SalesBoard
echo ============================================
echo.
echo Fazendo login no Firebase...
firebase login
echo.
echo Selecionando projeto...
firebase use painel-vendas-comercial
echo.
echo Implantando Cloud Function de notificacoes...
firebase deploy --only functions
echo.
echo ============================================
echo   Pronto! Notificacoes ativadas.
echo ============================================
pause
