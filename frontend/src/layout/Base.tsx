import Footer from './Footer'
import Header from './Header'

interface BaseProps {
  children?: React.ReactNode
}

/**
 * The base layout for the application.
 */
function Base({ children }: BaseProps) {
  return (
    <div className="flex flex-col h-[100vh]">
      <Header />

      <main className="flex-grow h-full bg-primary-50 xl:py-4">{children}</main>

      <Footer />
    </div>
  )
}

export default Base
