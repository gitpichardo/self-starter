import Link from 'next/link'
import Layout from '@/components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-primary-600">Self Starter</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Empower your personal growth journey with goal setting, habit tracking, and self-reflection tools.
          </p>
          <div className="mt-5 max-w-md mx-auto">
            <div className="rounded-md shadow">
              <Link href="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
                Enter Demo
              </Link>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            This is a demo version. No sign-up or sign-in required.
          </p>
        </div>
      </div>
    </Layout>
  )
}