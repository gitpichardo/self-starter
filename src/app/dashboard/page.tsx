'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import GoalInputForm from '../../components/GoalInputForm'
import GoalList from '../../components/GoalList'

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleGoalCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {session?.user?.name || 'User'}!</p>
      <GoalInputForm onGoalCreated={handleGoalCreated} />
      <GoalList refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default DashboardPage