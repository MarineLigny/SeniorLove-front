import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.scss'
import './scss/style.scss'
import App from './App.tsx'
// Importer le service d'auth pour configurer les intercepteurs Axios
import './utils/auth.ts'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
