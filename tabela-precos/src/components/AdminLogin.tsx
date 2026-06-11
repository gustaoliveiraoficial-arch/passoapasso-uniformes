import { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Loader } from 'lucide-react';
import { signInAdmin } from '../lib/firebase';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

export function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInAdmin(password);
      onLogin();
    } catch {
      setError('Senha incorreta. Tente novamente.');
      setShaking(true);
      setPassword('');
      setTimeout(() => setShaking(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className={`admin-login-box ${shaking ? 'admin-shake' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Lock size={24} className="text-white" />
          </div>
          <h2 className="admin-login-title">Acesso Administrativo</h2>
          <p className="admin-login-subtitle">Digite a senha para acessar o painel de edição</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Senha de administrador"
              className={`admin-input ${error ? 'admin-input-error' : ''}`}
              autoFocus
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="admin-eye-btn"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="admin-error">{error}</p>}
          <div className="admin-login-actions">
            <button type="button" onClick={onClose} className="admin-btn-cancel" disabled={loading}>Cancelar</button>
            <button type="submit" className="admin-btn-enter" disabled={loading}>
              {loading ? <Loader size={17} className="animate-spin" /> : <ShieldCheck size={17} />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
