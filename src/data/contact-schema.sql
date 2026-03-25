CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Allow anyone to insert (public contact form)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON contact_messages FOR INSERT WITH CHECK (true);
-- Only authenticated service role can read
CREATE POLICY "Service role can read messages" ON contact_messages FOR SELECT USING (auth.role() = 'service_role');
