-- Supabase Schema for MAD Tap

-- 1. Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Services
INSERT INTO services (name, slug, active) VALUES
('MAD Tap', 'mad-tap', true),
('360° Tours', '360-tours', true),
('Web Design', 'web-design', true),
('Software & Automation', 'software-automation', true),
('Social Media', 'social-media', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT,
    email TEXT,
    area TEXT,
    services UUID[] DEFAULT '{}',
    status TEXT DEFAULT 'Lead' CHECK (status IN ('Lead', 'Active', 'Completed', 'Churned')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Cards Table
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL UNIQUE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    destination_url TEXT,
    card_type TEXT DEFAULT 'Tap-to-Review' CHECK (card_type IN ('Tap-to-Review', 'Tap-to-Menu', 'Tap-to-Order', 'Other')),
    status TEXT DEFAULT 'Blank' CHECK (status IN ('Blank', 'Assigned', 'Active', 'Disabled')),
    assigned_date TIMESTAMP WITH TIME ZONE,
    nfc_taps INTEGER DEFAULT 0,
    qr_scans INTEGER DEFAULT 0,
    last_scanned_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Scan Events Table
CREATE TABLE IF NOT EXISTS scan_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    source TEXT CHECK (source IN ('nfc', 'qr', 'unknown')),
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    referrer TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cards_token ON cards(token);
CREATE INDEX IF NOT EXISTS idx_scan_events_card_id ON scan_events(card_id);

-- Row Level Security (RLS)
-- By default, allow everything for now assuming the studio uses a service role or anon key securely
-- You can lock this down in production by requiring authenticated users for insert/update.
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to prevent errors, then create
DROP POLICY IF EXISTS "Enable all access for all users" ON services;
CREATE POLICY "Enable all access for all users" ON services FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON clients;
CREATE POLICY "Enable all access for all users" ON clients FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON cards;
CREATE POLICY "Enable all access for all users" ON cards FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON scan_events;
CREATE POLICY "Enable all access for all users" ON scan_events FOR ALL USING (true);
