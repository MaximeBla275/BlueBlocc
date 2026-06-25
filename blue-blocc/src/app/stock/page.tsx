{error && (
      <div className="text-sm text-red-400 px-4 py-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        {error}
      </div>
    )}

    {canGerer && showCreate && (
      <form onSubmit={handleCreate} className="card p-6 grid grid-cols-1 md:grid-cols-[1fr_180px_auto_auto] gap-3">
        <input className="input" placeholder="Nom entrepôt" value={newNom} onChange={e => setNewNom(e.target.value)} autoFocus />
        <input className="input" type="number" min="1" placeholder="Capacité max (kg)" value={newCapacite} onChange={e => setNewCapacite(e.target.value)} />
        <button type="submit" className="btn-primary">Créer</button>
        <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>Annuler</button>
      </form>
    )}

    {entrepots.length === 0 ? (
      <div className="card p-12 text-center" style={{ color: 'var(--blocc-muted)' }}>
        <Package size={40} className="mx-auto mb-4 opacity-30" />
        <p className="text-sm">Aucun entrepôt</p>
      </div>
    ) : (
      <div className="space-y-4">
        {entrepots.map(e => {
          const stockE = e.stocks.reduce((s, st) => s + st.quantite, 0)
          const pct = e.capaciteMax > 0 ? Math.min(100, stockE / e.capaciteMax * 100) : 0

          return (
            <div key={e.id} className="card p-6">
              {editId === e.id ? (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_170px_auto_auto] gap-3">
                  <input className="input" value={editNom} onChange={ev => setEditNom(ev.target.value)} autoFocus />
                  <input className="input" type="number" min="1" value={editCapacite} onChange={ev => setEditCapacite(ev.target.value)} />
                  <button className="btn-primary" onClick={() => handleEditSave(e.id)}>Sauver</button>
                  <button className="btn-ghost" onClick={() => setEditId(null)}>Annuler</button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-lg font-bold text-white">{e.nom}</div>
                      <div className="text-3xl font-black mt-1" style={{ color: pct >= 90 ? '#f87171' : pct >= 60 ? '#fbbf24' : '#60a5fa' }}>
                        {formatKg(stockE)} <span className="text-base font-normal" style={{ color: 'var(--blocc-muted)' }}>/ {formatKg(e.capaciteMax)}</span>
                      </div>
                      <div className="progress-bar mt-3">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 90 ? 'linear-gradient(90deg,#ef4444,#f87171)' : undefined }} />
                      </div>
                      <div className="text-xs mt-2" style={{ color: 'var(--blocc-muted)' }}>Remplissage : <strong className="text-white">{Math.round(pct)}%</strong></div>
                    </div>
                    {canGerer && (
                      <div className="flex gap-2 flex-wrap justify-end">
                        <button className="p-2 rounded-lg" style={{ color: 'var(--blocc-muted)', background: 'rgba(255,255,255,0.05)' }}
                          onClick={() => { setRechargeId(rechargeId === e.id ? null : e.id); setTransferId(null); setRechargeItemId(items[0]?.id || ''); setRechargePrix(String(items[0]?.prixAchat || '')) }}
                          title="Recharger"><RefreshCw size={15} /></button>
                        <button className="p-2 rounded-lg" style={{ color: e.stocks.length > 0 ? '#a78bfa' : 'var(--blocc-muted)', background: e.stocks.length > 0 ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.05)' }}
                          onClick={() => openTransfert(e.id)}
                          title="Transférer vers un autre entrepôt" disabled={e.stocks.length === 0}>
                          <ArrowRightLeft size={15} />
                        </button>
                        <button className="p-2 rounded-lg" style={{ color: 'var(--blocc-muted)', background: 'rgba(255,255,255,0.05)' }}
                          onClick={() => { setEditId(e.id); setEditNom(e.nom); setEditCapacite(String(e.capaciteMax)) }}
                          title="Modifier"><Pencil size={15} /></button>
                        <button className="p-2 rounded-lg" style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)' }}
                          onClick={async () => { if (!confirm('Supprimer cet entrepôt ?')) return; await deleteEntrepot(e.id); load() }}
                          title="Supprimer"><Trash2 size={15} /></button>
                      </div>
                    )}
                  </div>

                  {e.stocks.length > 0 && (
                    <div className="mt-3">
                      <button className="flex items-center gap-1 text-xs" style={{ color: 'var(--blocc-muted)' }}
                        onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}>
                        {expandedId === e.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />} Détail items ({e.stocks.length})
                      </button>
                      {expandedId === e.id && (
                        <div className="mt-2 space-y-1">
                          {e.stocks.map(s => (
                            <div key={s.itemId} className="flex justify-between text-xs px-3 py-2 rounded"
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--blocc-border)' }}>
                              <span className="font-semibold text-white">{s.itemNom}</span>
                              <span style={{ color: 'var(--blocc-muted)' }}>
                                {formatKg(s.quantite)} · {formatMoney(s.prixAchatUnitaire)}/kg · val: {formatMoney(s.quantite * s.prixAchatUnitaire)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {canGerer && rechargeId === e.id && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--blocc-border)' }}>
                      <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--blocc-muted)' }}>
                        Recharger — coût déduit de la tréso
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_140px_auto_auto] gap-3">
                        <div>
                          <label className="label">Item</label>
                          <select className="input" value={rechargeItemId} onChange={ev => {
                            setRechargeItemId(ev.target.value)
                            const it = items.find(i => i.id === ev.target.value)
                            if (it) setRechargePrix(String(it.prixAchat))
                          }}>
                            <option value="">-- Choisir --</option>
                            {items.map(i => <option key={i.id} value={i.id}>{i.nom}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label">Quantité (kg)</label>
                          <input className="input" type="number" min="1" value={rechargeQty} onChange={ev => setRechargeQty(ev.target.value)} />
                        </div>
                        <div>
                          <label className="label">Prix achat $/kg</label>
                          <input className="input" type="number" min="1" value={rechargePrix} onChange={ev => setRechargePrix(ev.target.value)} />
                        </div>
                        <button className="btn-success self-end" onClick={() => handleRecharge(e.id)}>Recharger</button>
                        <button className="btn-ghost self-end" onClick={() => setRechargeId(null)}>Annuler</button>
                      </div>
                      {rechargeQty && rechargePrix && (
                        <div className="mt-2 text-xs" style={{ color: '#f87171' }}>
                          Sortie tréso : <strong>{formatMoney(Number(rechargeQty) * Number(rechargePrix))}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {canGerer && transferId === e.id && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--blocc-border)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <ArrowRightLeft size={14} style={{ color: '#a78bfa' }} />
                        <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#a78bfa' }}>
                          Transfert vers un autre entrepôt — neutre pour la tréso
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_140px_auto_auto] gap-3">
                        <div>
                          <label className="label">Item à transférer</label>
                          <select className="input" value={transferItemId} onChange={ev => setTransferItemId(ev.target.value)}>
                            <option value="">-- Choisir --</option>
                            {e.stocks.map(s => (
                              <option key={s.itemId} value={s.itemId}>{s.itemNom} ({formatKg(s.quantite)} dispo)</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label">Entrepôt destination</label>
                          <select className="input" value={transferDestId} onChange={ev => setTransferDestId(ev.target.value)}>
                            <option value="">-- Choisir --</option>
                            {entrepots.filter(dest => dest.id !== e.id).map(dest => {
                              const stockDest = dest.stocks.reduce((s, st) => s + st.quantite, 0)
                              const place = dest.capaciteMax - stockDest
                              return <option key={dest.id} value={dest.id}>{dest.nom} ({formatKg(place)} libre)</option>
                            })}
                          </select>
                        </div>
                        <div>
                          <label className="label">Quantité (kg)</label>
                          <input className="input" type="number" min="1"
                            max={e.stocks.find(s => s.itemId === transferItemId)?.quantite || undefined}
                            value={transferQty} onChange={ev => setTransferQty(ev.target.value)} />
                        </div>
                        <button className="self-end px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                          style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}
                          onClick={() => handleTransfert(e.id)}>
                          <ArrowRightLeft size={14} /> Transférer
                        </button>
                        <button className="btn-ghost self-end" onClick={() => setTransferId(null)}>Annuler</button>
                      </div>
                      {transferItemId && transferQty && (
                        <div className="mt-2 text-xs" style={{ color: '#a78bfa' }}>
                          Déplacement interne — aucune incidence sur la trésorerie
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    )}
  </div>
</AppLayout>
