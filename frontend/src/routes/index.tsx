import { createBrowserRouter } from 'react-router-dom'
import Base from '../layout/Base'
import Debug from './Debug'
import Home from './Home'
import NotFound from './NotFound'

/**
 * The router is a React component which uses the browser URL to determine which
 * elements to render.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Base>
        <Home />
      </Base>
    ),
  },
  {
    path: '/debug',
    element: (
      <Base>
        <Debug />
      </Base>
    ),
  },
  {
    path: '*',
    element: (
      <Base>
        <NotFound />
      </Base>
    ),
  },
])
