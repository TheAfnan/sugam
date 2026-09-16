'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) return { error: error.message }

  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role || 'student'

  revalidatePath('/', 'layout')
  if (role === 'admin' || role === 'faculty') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const enrollmentNumber = formData.get('enrollment_number') as string
  const department = formData.get('department') as string
  const yearOfStudy = parseInt(formData.get('year_of_study') as string)
  const phone = formData.get('phone') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        enrollment_number: enrollmentNumber,
        department,
        year_of_study: yearOfStudy,
        phone,
        role: 'student',
      },
    },
  })

  if (error) return { error: error.message }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      enrollment_number: enrollmentNumber,
      department,
      year_of_study: yearOfStudy,
      phone,
      role: 'student',
    })
    if (profileError) console.error('Profile creation error:', profileError)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}
