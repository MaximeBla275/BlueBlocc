'use client'

import React, { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/lib/auth-context'
import { Key } from 'lucide-react'

export default function ParametresPage() {
  const { profile, isLead, changePassword } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwSaving, setPwSaving] = useState(false)

  const handlePwChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(''); setPwSuccess('')
    if (newPassword.length < 6) { setPwError('Minimum 6 caractères'); return }
    if (newPassword !== confirmPassword) { setPwError('Les mots de passe ne correspondent pas'); return }
    setPwSaving(true)
    try {
      await changePassword(newPassword)
      setPwSuccess('Mot de passe mis à jour')
      setNewPassword(''); setConfirmPassword('')
    } catch {
      setPwError('Erreur lors du changement de mot de passe.')
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-8 pt-4">
        <div>
          <h1 className="text-2xl font-black text-white">Paramètres</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--blocc-muted)' }}>
            {isLead ? 'Config avancée disponible dans le Dashboard Lead' : 'Ton compte'}
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: 'var(--blocc-muted)' }}>
            <Key size={14} /> Mon mot de passe
          </h2>
          <form onSubmit={handlePwChange} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nouveau mot de passe</label>
                <input className="input" type="password" placeholder="min 6 caractères" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div>
                <label className="label">Confirmer</label>
                <input className="input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            {pwError && <div className="text-sm text-red-400 px-3 py-2 rounded" style={{ background: 'rgba(239,68,68,0.1)' }}>{pwError}</div>}
            {pwSuccess && <div className="text-sm text-green-400 px-3 py-2 rounded" style={{ background: 'rgba(34,197,94,0.1)' }}>{pwSuccess}</div>}
            <button type="submit" className="btn-primary" disabled={pwSaving}>{pwSaving ? 'Mise à jour...' : 'Changer le mot de passe'}</button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
