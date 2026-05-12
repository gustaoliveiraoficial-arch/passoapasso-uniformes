import { useState, useEffect } from 'react';
import { Moon, Sun, ShoppingBag, Lock, LogOut, Save, Cloud, CloudOff, Loader, Plus, Settings, FileText } from 'lucide-react';
import { pricingData as defaultPricing, extraData as defaultExtra } from './data/pricingData';
import type { Category } from './data/pricingData';
import { PricingTable } from './components/PricingTable';
import { PaymentInfo } from './components/PaymentInfo';
import { QuotationModal } from './components/QuotationModal';
import { AdminLogin, isAdminSession, clearAdminSession } from './components/AdminLogin';
import { AdminPricingTable } from './components/AdminPricingTable';
import { AdminExtrasModal } from './components/AdminExtrasModal';
import { loadFromFirestore, saveToFirestore } from './lib/firebase';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type ExtraData = typeof defaultExtra;

function App() {
  const [theme, setTheme] = useState('light');
  const [activeCategory, setActiveCategory] = useState(defaultPricing[0].id);

  // Data state — loaded from Firestore or falls back to default
  const [categories, setCategories] = useState<Category[]>(defaultPricing);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(isAdminSession());
  const [showLogin, setShowLogin] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [cloudConnected, setCloudConnected] = useState(false);
  const [editedCategories, setEditedCategories] = useState<Category[]>(defaultPricing);
  const [editedExtra, setEditedExtra] = useState<ExtraData>(defaultExtra);
  const [showExtrasModal, setShowExtrasModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load data from Firestore on mount
  useEffect(() => {
    loadFromFirestore().then(data => {
      if (data?.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
        setEditedCategories(data.categories);
        setCloudConnected(true);
      } else {
        setCategories(defaultPricing);
        setEditedCategories(defaultPricing);
      }
      if (data?.extraData) {
        setEditedExtra(data.extraData as ExtraData);
      }
      setDataLoaded(true);
    });
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const currentCategory = categories.find(c => c.id === activeCategory);

  const handleLogin = () => {
    setIsAdmin(true);
    setShowLogin(false);
    setEditedCategories([...categories]);
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAdmin(false);
    setEditedCategories([...categories]);
  };

  const handleCategoryChange = (updated: Category) => {
    setEditedCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddCategory = () => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      title: 'Nova Categoria',
      description: '',
      items: [],
    };
    setEditedCategories(prev => [...prev, newCat]);
    setActiveCategory(newCat.id);
  };

  const handleDeleteCategory = (id: string) => {
    const remaining = editedCategories.filter(c => c.id !== id);
    setEditedCategories(remaining);
    if (activeCategory === id) setActiveCategory(remaining[0]?.id ?? '');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await saveToFirestore({ categories: editedCategories, extraData: editedExtra });
      setCategories(editedCategories);
      setCloudConnected(true);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  const activeAdminCategory = editedCategories.find(c => c.id === activeCategory);
  const displayCategories = isAdmin ? editedCategories : categories;

  // Quotation modal
  const [showQuotation, setShowQuotation] = useState(false);

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl text-white shadow-lg">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 className="app-title">Tabela de Preços 2026</h1>
              <p className="app-subtitle">
                Passo a Passo Uniformes
                {!dataLoaded && <span className="ml-2 text-amber-500">· Carregando...</span>}
                {dataLoaded && cloudConnected && <span className="ml-2 text-green-500">· Nuvem sincronizada</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Quotation button */}
            <button onClick={() => setShowQuotation(true)} className="quotation-btn" title="Gerar orçamento para cliente">
              <FileText size={17} />
              Gerar Orçamento
            </button>

            {/* Cloud indicator */}
            <div className={`cloud-indicator ${cloudConnected ? 'cloud-ok' : 'cloud-off'}`} title={cloudConnected ? 'Dados salvos na nuvem' : 'Usando dados locais'}>
              {cloudConnected ? <Cloud size={15} /> : <CloudOff size={15} />}
            </div>

            {/* Admin: edit extras */}
            {isAdmin && (
              <button onClick={() => setShowExtrasModal(true)} className="admin-lock-btn" title="Editar personalizações e pagamento" style={{ color: '#7c3aed', borderColor: '#c4b5fd' }}>
                <Settings size={17} />
              </button>
            )}

            {/* Admin save button */}
            {isAdmin && (
              <button onClick={handleSave} disabled={saveStatus === 'saving'} className={`admin-save-header-btn ${saveStatus === 'saving' ? 'opacity-70' : ''} ${saveStatus === 'saved' ? 'admin-save-success' : ''} ${saveStatus === 'error' ? 'admin-save-error' : ''}`}>
                {saveStatus === 'saving' ? <Loader size={15} className="animate-spin" /> : <Save size={15} />}
                {saveStatus === 'idle' && 'Salvar na nuvem'}
                {saveStatus === 'saving' && 'Salvando...'}
                {saveStatus === 'saved' && '✓ Salvo!'}
                {saveStatus === 'error' && '✗ Erro ao salvar'}
              </button>
            )}

            {/* Admin toggle */}
            {isAdmin ? (
              <button onClick={handleLogout} className="admin-logout-btn" title="Sair do modo admin">
                <LogOut size={17} />
                Sair
              </button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="admin-lock-btn" title="Acesso administrativo">
                <Lock size={17} />
              </button>
            )}

            <button onClick={toggleTheme} className="theme-toggle" aria-label="Alternar tema">
              {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            </button>
          </div>
        </div>

        {isAdmin && (
          <div className="admin-mode-banner">
            🔓 Modo Administrativo Ativo — Edite os produtos e clique em "Salvar na nuvem" para confirmar
          </div>
        )}
      </header>

      {/* Login modal */}
      {showLogin && <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />}

      {/* Extras modal */}
      {showExtrasModal && (
        <AdminExtrasModal
          extraData={editedExtra}
          onSave={updated => { setEditedExtra(updated); setShowExtrasModal(false); }}
          onClose={() => setShowExtrasModal(false)}
        />
      )}

      {/* Main content */}
      <main className="main-content">
        {/* Category Nav */}
        <nav className="category-nav">
          {displayCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`tab-btn ${activeCategory === cat.id ? 'tab-btn-active' : ''}`}
            >
              {cat.title}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={handleAddCategory}
              className="tab-btn-add"
              title="Adicionar nova categoria"
            >
              <Plus size={15} />
              Nova categoria
            </button>
          )}
        </nav>

        {/* Table — admin vs view mode */}
        {isAdmin ? (
          activeAdminCategory && (
            <AdminPricingTable
              key={activeAdminCategory.id}
              category={activeAdminCategory}
              onChange={handleCategoryChange}
              onDelete={() => handleDeleteCategory(activeAdminCategory.id)}
            />
          )
        ) : (
          currentCategory && <PricingTable category={currentCategory} />
        )}

        <PaymentInfo extraData={editedExtra} isAdmin={isAdmin} onEdit={() => setShowExtrasModal(true)} />

        <footer className="app-footer">
          <p>Valores sujeitos a alteração sem aviso prévio.</p>
          <p>Tabela Oficial · 2026</p>
        </footer>
      </main>

      {/* Quotation Modal */}
      {showQuotation && (
        <QuotationModal
          categories={categories}
          extraData={editedExtra}
          onClose={() => setShowQuotation(false)}
        />
      )}
    </div>
  );
}

export default App;
