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

const testAccounts = [
  {
    email: 'admin@alphacadeau.fr',
    password: 'Admin123!',
    role: 'admin',
    fullName: 'Administrateur'
  },
  {
    email: 'creator@alphacadeau.fr',
    password: 'Creator123!',
    role: 'creator',
    fullName: 'Créateur Test'
  },
  {
    email: 'provider@alphacadeau.fr',
    password: 'Provider123!',
    role: 'provider',
    fullName: 'Prestataire Test'
  },
  {
    email: 'client@alphacadeau.fr',
    password: 'Client123!',
    role: 'client',
    fullName: 'Client Test'
  }
]

async function createTestAccounts() {
  console.log('Creating test accounts...\n')

  for (const account of testAccounts) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.fullName
        }
      })

      if (error) {
        console.error(`Error creating ${account.role}:`, error.message)
        continue
      }

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

      console.log(`✓ Created ${account.role}: ${account.email} / ${account.password}`)
    } catch (err) {
      console.error(`Error with ${account.email}:`, err)
    }
  }

  console.log('\n✓ Test accounts created successfully!')
}

createTestAccounts()
