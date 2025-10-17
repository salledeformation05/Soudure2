import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createClientAccount() {
  console.log('Creating client test account...\n')

  const account = {
    email: 'client@alphacadeau.fr',
    password: 'Client123!',
    role: 'client',
    fullName: 'Client Test'
  }

  try {
    // Create user in auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: {
        full_name: account.fullName
      }
    })

    if (error) {
      console.error(`Error creating client:`, error.message)
      return
    }

    // Create profile
    await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        email: account.email,
        full_name: account.fullName,
        role: account.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    console.log(`✓ Created client: ${account.email} / ${account.password}`)
    console.log('\n✓ Client account created successfully!')
  } catch (err) {
    console.error(`Error:`, err)
  }
}

createClientAccount()
