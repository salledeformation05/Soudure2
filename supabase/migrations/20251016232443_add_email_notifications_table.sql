/*
  # Add Email Notifications Table

  1. New Tables
    - `email_notifications`
      - `id` (uuid, primary key)
      - `recipient_email` (text) - recipient email address
      - `subject` (text) - email subject
      - `message` (text) - email message content
      - `order_id` (uuid, nullable) - reference to orders table
      - `order_status` (text, nullable) - order status at time of sending
      - `sent_at` (timestamptz) - timestamp when email was sent
      - `status` (text) - email status (sent, failed, pending)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `email_notifications` table
    - Add policy for authenticated users to view their own email notifications
    - Add policy for admin users to view all email notifications
*/

CREATE TABLE IF NOT EXISTS email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  order_status text,
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email notifications"
  ON email_notifications
  FOR SELECT
  TO authenticated
  USING (
    recipient_email IN (
      SELECT email FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all email notifications"
  ON email_notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_email_notifications_order_id ON email_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON email_notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_notifications_sent_at ON email_notifications(sent_at);
