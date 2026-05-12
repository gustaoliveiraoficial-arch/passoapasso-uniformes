const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export async function uploadParaCloudinary(
  file: File,
  pasta: 'layouts' | 'vetores' | 'artes-cliente' | 'rascunho-vendedor' | 'recibo-pagamento',
  pedidoId: string
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary não configurado. Verifique NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET no .env.local'
    )
  }

  // Imagens → resource_type image; PDFs e outros (CDR, etc.) → raw
  const isImagem = file.type.startsWith('image/')
  const resourceType = isImagem ? 'image' : 'raw'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', `pap-pedidos/${pedidoId}/${pasta}`)

  // Para arquivos raw (PDF, CDR), incluímos o nome original para facilitar identificação
  if (!isImagem) {
    formData.append('public_id', `pap-pedidos/${pedidoId}/${pasta}/${file.name}`)
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  )

  let data: Record<string, unknown>
  try {
    data = await res.json()
  } catch {
    throw new Error(`Erro de comunicação com o servidor de upload (HTTP ${res.status})`)
  }

  if (!res.ok) {
    const errMsg = (data.error as { message?: string } | undefined)?.message
    if (errMsg?.includes('upload_preset')) {
      throw new Error(`Preset de upload inválido. Verifique a configuração "${UPLOAD_PRESET}" no painel do Cloudinary.`)
    }
    if (errMsg?.includes('unsigned')) {
      throw new Error('O preset de upload não permite uploads não assinados. Configure-o como "Unsigned" no Cloudinary.')
    }
    throw new Error(errMsg || `Erro ao enviar arquivo (HTTP ${res.status})`)
  }

  return data.secure_url as string
}
