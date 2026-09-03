import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClient, QueryClientContext} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientContext value={queryClient}>
      <App/>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientContext>
  </StrictMode>,
)
