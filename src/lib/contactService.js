import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Submit a contact form message to Supabase.
 *
 * NOTE: A Supabase Edge Function should be set up to forward new
 * contact_messages to Kevin.woodland@tryvenato.com
 */
export async function submitContactForm({ name, email, subject, message }) {
  if (!isSupabaseConfigured()) {
    return { error: 'Not configured' }
  }

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }])

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { error: err.message || 'Failed to submit message' }
  }
}
