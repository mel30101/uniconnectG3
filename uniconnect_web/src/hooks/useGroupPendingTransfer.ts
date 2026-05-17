import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firestore'

interface PendingTransfer {
  candidateId: string
  requesterId: string
  status: 'pending' | 'accepted' | 'rejected'
  requestedAt: unknown
}

export function useGroupPendingTransfer(groupId: string) {
  const [pendingTransfer, setPendingTransfer] = useState<PendingTransfer | null>(null)

  useEffect(() => {
    if (!groupId) return
    const unsub = onSnapshot(doc(db, 'groups', groupId), (snap) => {
      const data = snap.data()
      if (data?.pendingAdminTransfer) {
        setPendingTransfer(data.pendingAdminTransfer as PendingTransfer)
      } else {
        setPendingTransfer(null)
      }
    })
    return () => unsub()
  }, [groupId])

  return pendingTransfer
}
