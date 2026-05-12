import { useState, useCallback, useEffect, useRef } from 'react'
import {
  PlusCircle, Trash2, Edit3, Save, Download,
  RotateCcw, ChevronDown, ChevronUp, Check, Cloud
} from 'lucide-react'
import { defaultData } from './data'
import type { Category, Item } from './data'
import { QuotaChat } from './components/QuotaChat'

const STORAGE_KEY = 'tabela-precos-editor-v1'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

async function loadFromCloud(): Promise<Category[] | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/tabela_precos?id=eq.main&select=data`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    if (!res.ok) return null
    const rows = await res.json() as { data: Category[] }[]
    if (!rows.length) return null
    return rows[0].data
  } catch {
    return null
  }
}

async function saveToCloud(categories: Category[]): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tabela_precos`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ id: 'main', data: categories, updated_at: new Date().toISOString() }),
    })
    return res.ok
  } catch {
    return false
  }
}

function migrateQtyLabels(data: Category[]): Category[] {
  // Migra labels antigos "10 pçs" → "+10 pçs" para dados salvos no localStorage
  const map: Record<string, string> = {
    '10 pçs': '+10 pçs', '20 pçs': '+20 pçs', '30 pçs': '+30 pçs',
    '40 pçs': '+40 pçs', '50 pçs': '+50 pçs',
  }
  return data.map(cat => ({
    ...cat,
    items: cat.items.map(item => ({
      ...item,
      tiers: item.tiers.map(t => ({ ...t, qty: map[t.qty] ?? t.qty })),
    })),
  }))
}

function loadLocalData(): Category[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultData
    const parsed = JSON.parse(saved) as Category[]
    return migrateQtyLabels(parsed)
  } catch {
    return defaultData
  }
}

// Coleta todos os rótulos de quantidade únicos de uma categoria (ordem de inserção)
function getCategoryTiers(category: Category): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of category.items) {
    for (const tier of item.tiers) {
      if (!seen.has(tier.qty)) {
        seen.add(tier.qty)
        result.push(tier.qty)
      }
    }
  }
  return result
}

function formatPrice(price: string | number): string {
  if (price === 'Orçar') return 'Orçar'
  const n = Number(price)
  if (isNaN(n)) return String(price)
  return `R$ ${n.toFixed(2).replace('.', ',')}`
}

// Input inline editável
function EI({
  value,
  onChange,
  placeholder = '',
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={`edit-input ${className}`}
    />
  )
}

interface BlockProps {
  category: Category
  isEditing: boolean
  onToggleEdit: () => void
  onUpdate: (cat: Category) => void
  onDelete: () => void
}

function CategoryBlock({ category, isEditing, onToggleEdit, onUpdate, onDelete }: BlockProps) {
  const [collapsed, setCollapsed] = useState(false)

  const allTiers = getCategoryTiers(category)

  // --- Atualizações de campos da categoria ---
  const updateCatField = (field: 'title' | 'description', value: string) => {
    onUpdate({ ...category, [field]: value })
  }

  // --- Atualizações de campos do item ---
  const updateItemField = (itemId: string, field: 'name' | 'colors' | 'obs', value: string) => {
    onUpdate({
      ...category,
      items: category.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    })
  }

  // --- Atualizar preço de um tier específico de um item ---
  const updateTierPrice = (itemId: string, qty: string, value: string) => {
    onUpdate({
      ...category,
      items: category.items.map(item => {
        if (item.id !== itemId) return item
        return {
          ...item,
          tiers: item.tiers.map(t => (t.qty === qty ? { ...t, price: value } : t)),
        }
      }),
    })
  }

  // --- Renomear cabeçalho de coluna (atualiza todos os itens) ---
  const updateTierHeader = (oldQty: string, newQty: string) => {
    onUpdate({
      ...category,
      items: category.items.map(item => ({
        ...item,
        tiers: item.tiers.map(t => (t.qty === oldQty ? { ...t, qty: newQty } : t)),
      })),
    })
  }

  // --- Adicionar coluna de preço em todos os itens ---
  const addTierColumn = () => {
    const newQty = 'N pçs'
    onUpdate({
      ...category,
      items: category.items.map(item => ({
        ...item,
        tiers: [...item.tiers, { qty: newQty, price: 0 }],
      })),
    })
  }

  // --- Remover coluna de preço de todos os itens ---
  const removeTierColumn = (qty: string) => {
    onUpdate({
      ...category,
      items: category.items.map(item => ({
        ...item,
        tiers: item.tiers.filter(t => t.qty !== qty),
      })),
    })
  }

  // --- Adicionar produto ---
  const addItem = () => {
    const newItem: Item = {
      id: `${category.id}-${Date.now()}`,
      name: 'Novo produto',
      colors: 'Consultar',
      obs: '',
      tiers: allTiers.length > 0
        ? allTiers.map(qty => ({ qty, price: 0 }))
        : [{ qty: '10 pçs', price: 0 }],
    }
    onUpdate({ ...category, items: [...category.items, newItem] })
  }

  // --- Remover produto ---
  const removeItem = (itemId: string) => {
    onUpdate({ ...category, items: category.items.filter(i => i.id !== itemId) })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Cabeçalho do bloco */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-violet-50 border-b border-slate-200">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <EI
              value={category.title}
              onChange={v => updateCatField('title', v)}
              className="text-base font-bold text-slate-800"
            />
          ) : (
            <span className="text-base font-bold text-slate-800 truncate block">{category.title}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleEdit}
            title={isEditing ? 'Fechar edição' : 'Editar bloco'}
            className={`p-1.5 rounded-lg transition-all ${
              isEditing
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isEditing ? <Check size={15} /> : <Edit3 size={15} />}
          </button>

          {isEditing && (
            <button
              onClick={onDelete}
              title="Excluir bloco"
              className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
            >
              <Trash2 size={15} />
            </button>
          )}

          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
        </div>
      </div>

      {/* Corpo do bloco */}
      {!collapsed && (
        <div className="p-4 flex-1">
          {/* Descrição */}
          {(category.description !== undefined || isEditing) && (
            <div className="mb-4 text-sm text-slate-500">
              {isEditing ? (
                <EI
                  value={category.description ?? ''}
                  onChange={v => updateCatField('description', v)}
                  placeholder="Descrição / observações gerais..."
                />
              ) : (
                category.description && <p>{category.description}</p>
              )}
            </div>
          )}

          {/* Tabela */}
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-2 px-1 text-xs font-semibold text-slate-500 uppercase tracking-wide w-48 min-w-[140px]">
                    Produto
                  </th>
                  {allTiers.map(qty => (
                    <th key={qty} className="px-2 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {isEditing ? (
                        <div className="flex flex-col items-center gap-1">
                          <EI
                            value={qty}
                            onChange={v => updateTierHeader(qty, v)}
                            className="text-center text-xs w-16"
                          />
                          <button
                            onClick={() => removeTierColumn(qty)}
                            title="Remover coluna"
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ) : (
                        qty
                      )}
                    </th>
                  ))}
                  {isEditing && (
                    <th className="px-2 py-2 text-center">
                      <button
                        onClick={addTierColumn}
                        title="Adicionar coluna de preço"
                        className="text-green-500 hover:text-green-700"
                      >
                        <PlusCircle size={14} />
                      </button>
                    </th>
                  )}
                  {isEditing && <th className="w-7" />}
                </tr>
              </thead>
              <tbody>
                {category.items.map(item => {
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      {/* Coluna produto */}
                      <td className="py-2.5 px-1 min-w-[140px]">
                        {isEditing ? (
                          <div className="flex flex-col gap-1">
                            <EI
                              value={item.name}
                              onChange={v => updateItemField(item.id, 'name', v)}
                              className="font-semibold text-slate-800 text-sm"
                            />
                            <EI
                              value={item.colors}
                              onChange={v => updateItemField(item.id, 'colors', v)}
                              placeholder="Cores disponíveis"
                              className="text-xs text-slate-500"
                            />
                            <EI
                              value={item.obs ?? ''}
                              onChange={v => updateItemField(item.id, 'obs', v)}
                              placeholder="Observação (opcional)"
                              className="text-xs text-slate-400 italic"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-slate-800">{item.name}</p>
                            {item.colors && (
                              <p className="text-xs text-slate-500 mt-0.5">{item.colors}</p>
                            )}
                            {item.obs && (
                              <p className="text-xs text-slate-400 italic mt-0.5">{item.obs}</p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Colunas de preço */}
                      {allTiers.map(qty => {
                        const tier = item.tiers.find(t => t.qty === qty)
                        const isOrcar = tier?.price === 'Orçar'
                        return (
                          <td key={qty} className="px-2 py-2.5 text-center whitespace-nowrap">
                            {tier ? (
                              isEditing ? (
                                <EI
                                  value={String(tier.price)}
                                  onChange={v => updateTierPrice(item.id, qty, v)}
                                  className={`text-center text-sm font-bold w-16 mx-auto ${
                                    isOrcar ? 'text-slate-500' : 'text-blue-600'
                                  }`}
                                />
                              ) : (
                                <span
                                  className={`text-sm font-bold ${
                                    isOrcar ? 'text-slate-400 italic text-xs' : 'text-blue-600'
                                  }`}
                                >
                                  {formatPrice(tier.price)}
                                </span>
                              )
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                        )
                      })}

                      {/* Coluna de ações na edição */}
                      {isEditing && (
                        <>
                          <td />
                          <td className="py-2.5 pr-1 text-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              title="Remover produto"
                              className="text-red-400 hover:text-red-600 p-0.5"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Botão adicionar produto */}
          {isEditing && (
            <button
              onClick={addItem}
              className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 py-1 transition-colors"
            >
              <PlusCircle size={14} /> Adicionar produto
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>(loadLocalData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savedFeedback, setSavedFeedback] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'synced' | 'error'>('loading')
  const isFirstRender = useRef(true)

  // Carrega da nuvem ao iniciar
  useEffect(() => {
    loadFromCloud().then(cloudData => {
      if (cloudData && cloudData.length > 0) {
        const migrated = migrateQtyLabels(cloudData)
        setCategories(migrated)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
        setSyncStatus('synced')
      } else {
        setSyncStatus('idle')
      }
    })
  }, [])

  // Auto-salva no localStorage sempre que categories mudar (exceto na carga inicial)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }, [categories])

  const updateCategory = useCallback((catId: string, updated: Category) => {
    setCategories(prev => prev.map(c => (c.id === catId ? updated : c)))
  }, [])

  const deleteCategory = useCallback((catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId))
    setEditingId(prev => (prev === catId ? null : prev))
  }, [])

  const addCategory = () => {
    const id = `cat-${Date.now()}`
    setCategories(prev => [
      ...prev,
      { id, title: 'Nova Categoria', description: '', items: [] },
    ])
    setEditingId(id)
  }

  const handleSave = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    setSyncStatus('loading')
    const ok = await saveToCloud(categories)
    setSyncStatus(ok ? 'synced' : 'error')
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2000)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(categories, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tabela-precos.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    if (confirm('Resetar para os dados padrão? Todas as edições serão perdidas.')) {
      localStorage.removeItem(STORAGE_KEY)
      setCategories(defaultData)
      setEditingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior fixa */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Editor de Tabela de Preços</h1>
            <p className="text-xs text-slate-400">Uniformes & Fardamentos 2026</p>
          </div>

          <div className="flex items-center gap-2">
            {syncStatus === 'loading' && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                <Cloud size={12} className="animate-pulse" /> Sincronizando...
              </span>
            )}
            {syncStatus === 'synced' && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-green-500">
                <Cloud size={12} /> Nuvem OK
              </span>
            )}
            {syncStatus === 'error' && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-red-400">
                <Cloud size={12} /> Sem nuvem
              </span>
            )}
            <button
              onClick={handleReset}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
            >
              <RotateCcw size={14} /> Resetar
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
            >
              <Download size={14} /> Exportar
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg font-semibold transition-all ${
                savedFeedback
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Save size={14} /> {savedFeedback ? 'Salvo!' : 'Salvar'}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Contador de blocos */}
        <p className="text-sm text-slate-400 mb-4">
          {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}{' '}
          {editingId ? '— clique em ✓ para fechar a edição' : '— clique em ✎ para editar um bloco'}
        </p>

        {/* Grid de blocos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {categories.map(cat => (
            <CategoryBlock
              key={cat.id}
              category={cat}
              isEditing={editingId === cat.id}
              onToggleEdit={() =>
                setEditingId(prev => (prev === cat.id ? null : cat.id))
              }
              onUpdate={updated => updateCategory(cat.id, updated)}
              onDelete={() => deleteCategory(cat.id)}
            />
          ))}
        </div>

        {/* Botão nova categoria */}
        <button
          onClick={addCategory}
          className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all text-sm font-medium"
        >
          <PlusCircle size={18} /> Adicionar nova categoria
        </button>
      </main>

      {/* Chat de Orçamento IA */}
      <QuotaChat />
    </div>
  )
}
