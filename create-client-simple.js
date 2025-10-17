import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.log('\nPlease add SUPABASE_SERVICE_ROLE_KEY to your .env file')
  console.log('You can find it in your Supabase project settings under API')
  process.exit(1)
}

async function createClientAccount() {
  console.log('🔧 Creating client test account...\n')

  try {
    // Create user via Supabase Admin API
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        email: 'client@alphacadeau.fr',
        password: 'Client123!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Client Test'
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.msg && data.msg.includes('already registered')) {
        console.log('ℹ️  User already exists, updating profile...')

        // Get existing user
        const getUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users?email=client@alphacadeau.fr`, {
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          }
        })

        const users = await getUserResponse.json()
        if (users && users.length > 0) {
          const userId = users[0].id

          // Update profile
          const updateResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              role: 'client',
              full_name: 'Client Test'
            })
          })

          if (updateResponse.ok) {
            console.log('✅ Profile updated successfully!')
          }
        }
      } else {
        throw new Error(data.msg || JSON.stringify(data))
      }
    } else {
      console.log('✅ User created in auth.users')

      // Create profile
      const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          id: data.id,
          email: 'client@alphacadeau.fr',
          full_name: 'Client Test',
          role: 'client'
        })
      })

      if (!profileResponse.ok) {
        const profileError = await profileResponse.text()
        console.warn('⚠️  Profile creation warning:', profileError)
      } else {
        console.log('✅ Profile created successfully')
      }
    }

    console.log('\n✅ Client account ready!')
    console.log('\n📧 Email: client@alphacadeau.fr')
    console.log('🔑 Password: Client123!')
    console.log('\n✨ You can now login with these credentials')

  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

createClientAccount()
