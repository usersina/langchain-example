function Footer() {
  return (
    <footer className="py-4 text-white bg-primary-800">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; 2023{' | '}
          <span className="text-xs text-primary-50">
            API URL:{' '}
            <a
              className="hover:underline"
              href={import.meta.env.VITE_API_URL}
              target="_blank"
            >
              {import.meta.env.VITE_API_URL}
            </a>
          </span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
