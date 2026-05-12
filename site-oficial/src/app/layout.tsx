import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Passo a Passo Uniformes | Seu uniforme, sua história",
  description: "Há 30 anos vestindo quem faz acontecer. Especialistas em uniformes para formandos, escolas e empresas no Vale dos Sinos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
