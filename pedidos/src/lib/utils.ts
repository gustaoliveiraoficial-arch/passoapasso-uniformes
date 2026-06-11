import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatarData(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('pt-BR')
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarCPF(cpf: string): string {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function formatarCNPJ(cnpj: string): string {
  return cnpj
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export function formatarCEP(cep: string): string {
  return cep.replace(/\D/g, '').replace(/(\d{5})(\d{1,3})$/, '$1-$2')
}

// Extrai só o pathname do BASE_URL para montar o src da logo corretamente
// Produção: https://passoapassouniformes.com/formalizarpedido → /formalizarpedido/logo-pap.png
// Local: http://localhost:3001 → /logo-pap.png
export const LOGO_URL = (() => {
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  if (!base) return '/logo-pap.png'
  try { return new URL(base).pathname.replace(/\/$/, '') + '/logo-pap.png' }
  catch { return '/logo-pap.png' }
})()

export function gerarLinkCliente(token: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
  return `${base}/tamanhos/${token}`
}

export function gerarLinkArteFinalista(pedidoId: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
  return `${base}/arquivos/${pedidoId}`
}

// Firebase Storage já serve com Content-Disposition: attachment (configurado no upload)
// Cloudinary raw: usa fl_attachment como fallback
export function urlVerPDF(url: string): string {
  if (!url) return url
  if (url.includes('cloudinary.com') && url.includes('/raw/upload/')) {
    return url.replace('/raw/upload/', '/raw/upload/fl_attachment/')
  }
  return url
}
