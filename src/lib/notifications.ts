const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

interface NotificationData {
  userId: string
  type: string
  title: string
  message: string
  channels?: string[]
}

export async function sendNotification(data: NotificationData): Promise<void> {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/send-notification`
    const headers = {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to send notification')
    }
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}
