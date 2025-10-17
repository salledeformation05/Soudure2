/*
  # Add WhatsApp Notifications Table

  1. New Tables
    - `whatsapp_notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `phone` (text, phone number in international format)
      - `message` (text, message content)
      - `type` (text, notification type: order_confirmation, order_update, delivery, etc.)
      - `status` (text, sent/failed/pending)
      - `response` (jsonb, API response)
      - `created_at` (timestamptz)
      - `sent_at` (timestamptz)

  2. Security
    - Enable RLS on `whatsapp_notifications` table
    - Add policies for admins and providers to view notifications
    - Users can view their own WhatsApp notifications

  3. Indexes
    - Index on user_id for faster queries
    - Index on status for filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS whatsapp_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  phone text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  response jsonb,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

ALTER TABLE whatsapp_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own WhatsApp notifications"
  ON whatsapp_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all WhatsApp notifications"
  ON whatsapp_notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can insert WhatsApp notifications"
  ON whatsapp_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_whatsapp_notifications_user_id ON whatsapp_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_notifications_status ON whatsapp_notifications(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_notifications_created_at ON whatsapp_notifications(created_at DESC);
