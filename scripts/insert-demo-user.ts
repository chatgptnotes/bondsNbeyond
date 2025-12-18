// Script to insert a demo user into Supabase
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function insertDemoUser() {
  console.log('🔗 Connecting to Supabase:', supabaseUrl)

  const demoUser = {
    email: 'demo@linkist.com',
    first_name: 'Demo',
    last_name: 'User',
    phone_number: '+1234567890',
    country: 'India',
    country_code: 'IN',
    role: 'user',
    status: 'active',
    email_verified: true,
    mobile_verified: true,
    password_hash: 'demo_password_hash_placeholder' // Required field
  }

  console.log('📝 Inserting demo user:', demoUser.email)

  // First check if user already exists
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('email', demoUser.email)
    .single()

  if (existing) {
    console.log('✅ Demo user already exists:')
    console.log(JSON.stringify(existing, null, 2))
    return
  }

  // Insert new user
  const { data, error } = await supabase
    .from('users')
    .insert(demoUser)
    .select()
    .single()

  if (error) {
    console.error('❌ Error inserting user:', error.message)
    console.error('Details:', error)
    process.exit(1)
  }

  console.log('✅ Demo user created successfully!')
  console.log(JSON.stringify(data, null, 2))
}

insertDemoUser()
