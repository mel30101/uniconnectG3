import { Outlet } from 'react-router-dom'
import Header from './Header'
import { useProfile } from '../hooks/useProfile'

export default function Layout() {
  useProfile() // ensures profile is fetched regardless of which route the user lands on

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-slate-900">
      <Header />
      <main className="pt-14 px-4 pb-4 md:px-6 md:pb-6">
        <Outlet />
      </main>
    </div>
  )
}
