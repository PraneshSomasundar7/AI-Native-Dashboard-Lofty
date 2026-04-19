import { insforge } from '../lib/insforge'

export async function registerUser({ email, password, full_name, role }) {
  const { data: existing } = await insforge.database
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) return { success: false, error: 'An account with this email already exists.' }

  const { data, error } = await insforge.database
    .from('profiles')
    .insert([{ email, password, full_name, role }])
    .select()

  if (error) return { success: false, error: 'Registration failed. Please try again.' }

  const { password: _, ...safeUser } = data[0]
  return { success: true, user: safeUser }
}

export async function loginUser({ email, password }) {
  const { data, error } = await insforge.database
    .from('profiles')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .maybeSingle()

  if (error) return { success: false, error: 'Network error. Please try again.' }
  if (!data) return { success: false, error: 'Invalid email or password.' }

  const { password: _, ...safeUser } = data
  return { success: true, user: safeUser }
}
