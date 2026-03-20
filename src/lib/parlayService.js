/**
 * Service for saving and loading parlays from Supabase.
 */

import { supabase, isSupabaseConfigured } from './supabase'

// Save a new parlay
export async function saveParlay(userId, { legs, wager, parlayOdds, potentialPayout }) {
  if (!isSupabaseConfigured()) return { error: { message: 'Not configured' } }

  const { data, error } = await supabase
    .from('parlays')
    .insert({
      user_id: userId,
      legs: legs.map(l => ({
        gameId: l.gameId,
        type: l.type,
        pick: l.pick,
        odds: l.odds,
        description: l.description,
        homeAbbr: l.game?.homeTeam?.abbreviation || '',
        awayAbbr: l.game?.awayTeam?.abbreviation || '',
      })),
      wager,
      parlay_odds: parlayOdds,
      potential_payout: potentialPayout,
      status: 'saved', // saved | placed | won | lost
    })
    .select()
    .single()

  return { data, error }
}

// Get all parlays for a user
export async function getUserParlays(userId) {
  if (!isSupabaseConfigured()) return { data: [], error: null }

  const { data, error } = await supabase
    .from('parlays')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}

// Update parlay status (saved → placed → won/lost)
export async function updateParlayStatus(parlayId, status) {
  if (!isSupabaseConfigured()) return { error: { message: 'Not configured' } }

  const { data, error } = await supabase
    .from('parlays')
    .update({ status })
    .eq('id', parlayId)
    .select()
    .single()

  return { data, error }
}

// Delete a parlay
export async function deleteParlay(parlayId) {
  if (!isSupabaseConfigured()) return { error: { message: 'Not configured' } }

  const { error } = await supabase
    .from('parlays')
    .delete()
    .eq('id', parlayId)

  return { error }
}
