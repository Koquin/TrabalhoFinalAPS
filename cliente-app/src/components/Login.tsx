import { useState } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    // Mock de autenticação
    setTimeout(() => {
      if (email === "funcionario@lavanderia.com" && senha === "senha123") {
        onLogin();
      } else {
        setErro("Email ou senha incorretos!");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🧺</div>
            <h1 className="login-title">Lavanderia Premium</h1>
            <p className="login-subtitle">Portal do Funcionário</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label className="field-label">
                <span className="label-icon">📧</span>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="funcionario@lavanderia.com"
                className="field-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                <span className="label-icon">🔒</span>
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="field-input"
                required
              />
            </div>

            {erro && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`login-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Entrando...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="demo-info">
              <span className="info-icon">💡</span>
              <strong>Demo:</strong> funcionario@lavanderia.com / senha123
            </p>
          </div>
        </div>

        <div className="login-bg-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
}
