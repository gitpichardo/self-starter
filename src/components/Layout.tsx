import React from 'react'
import Head from 'next/head'

type LayoutProps = {
  children: React.ReactNode
  title?: string
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Self-Help App' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        {/* We'll add navigation here later */}
      </header>
      <main>{children}</main>
      <footer>
        {/* We'll add footer content here later */}
      </footer>
    </>
  )
}

export default Layout