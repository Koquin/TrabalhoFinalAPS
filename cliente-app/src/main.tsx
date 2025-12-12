import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TelaPedidoCliente from './components/PedidoCliente'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelaPedidoCliente />
  </StrictMode>,
)
