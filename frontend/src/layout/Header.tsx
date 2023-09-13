import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header className="sticky top-0 py-4 text-white bg-primary-800">
      <nav className="container flex items-center justify-between px-4 mx-auto">
        <a href="/" className="text-xl font-bold">
          LangChain Example
        </a>
        <ul className="flex">
          <li className="ml-4">
            <NavLink
              to={'/'}
              className={({ isActive }) =>
                isActive
                  ? 'font-bold hover:text-gray-300'
                  : 'hover:text-gray-300'
              }
            >
              Home
            </NavLink>
          </li>
          <li className="ml-4">
            <NavLink
              to={'/debug'}
              className={({ isActive }) =>
                isActive
                  ? 'font-bold hover:text-gray-300'
                  : 'hover:text-gray-300'
              }
            >
              Debug
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
