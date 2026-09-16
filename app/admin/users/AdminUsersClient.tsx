'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateUserRole } from '@/lib/actions/admin'
import { UserCheck, Search, Shield, GraduationCap, Loader2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { Profile, UserRole } from '@/types'

interface Props {
  users: Profile[]
}

export default function AdminUsersClient({ users }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.enrollment_number || '').toLowerCase().includes(q) ||
        (u.department || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setLoading(true)
    try {
      const res = await updateUserRole(userId, newRole)
      if (res.error) toast.error(res.error)
      else {
        toast.success(`Role updated to ${newRole}`)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">User & Role Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          View all registered student and faculty accounts. Elevate permissions or change roles.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Name, Email, Enrollment No, Department..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e]"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'student', 'faculty', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                'px-3.5 py-2 text-xs font-bold rounded-xl border transition-all capitalize',
                roleFilter === r
                  ? 'bg-[#1a237e] text-white border-[#1a237e]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 font-black text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Enrollment No.</th>
                <th className="p-4">Department</th>
                <th className="p-4">Year</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-black text-slate-900">{u.full_name}</p>
                        <p className="text-slate-400 text-[11px]">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700">
                      {u.enrollment_number || 'N/A'}
                    </td>
                    <td className="p-4 text-slate-600 max-w-[150px] truncate">
                      {u.department || 'N/A'}
                    </td>
                    <td className="p-4 font-bold">{u.year_of_study ? `Year ${u.year_of_study}` : 'N/A'}</td>
                    <td className="p-4">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full font-black text-[10px] uppercase',
                        u.role === 'admin' ? 'bg-red-100 text-red-800' :
                        u.role === 'faculty' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        disabled={loading}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No users match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
