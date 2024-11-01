-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    subscription_level TEXT NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comic styles table
CREATE TABLE comic_styles (
    style_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Characters table
CREATE TABLE characters (
    character_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    traits JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Panels table
CREATE TABLE panels (
    panel_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(character_id) ON DELETE SET NULL,
    style_id UUID NOT NULL REFERENCES comic_styles(style_id),
    image_url TEXT NOT NULL,
    order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default comic styles
INSERT INTO comic_styles (name, description) VALUES
    ('manga', 'Japanese manga style with clean lines and expressive features'),
    ('superhero', 'Classic superhero comic book style with bold colors'),
    ('cartoon', 'Playful cartoon style with exaggerated features'),
    ('classic', 'Traditional comic book style with detailed linework');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_panels_updated_at
    BEFORE UPDATE ON panels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_characters_project_id ON characters(project_id);
CREATE INDEX idx_panels_project_id ON panels(project_id);
CREATE INDEX idx_panels_character_id ON panels(character_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own data
CREATE POLICY users_policy ON users
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Projects are only accessible by their owners
CREATE POLICY projects_policy ON projects
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Characters are only accessible through project ownership
CREATE POLICY characters_policy ON characters
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.project_id = characters.project_id
        AND projects.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.project_id = characters.project_id
        AND projects.user_id = auth.uid()
    ));

-- Panels are only accessible through project ownership
CREATE POLICY panels_policy ON panels
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.project_id = panels.project_id
        AND projects.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.project_id = panels.project_id
        AND projects.user_id = auth.uid()
    ));

-- Payments are only accessible by the user who made them
CREATE POLICY payments_policy ON payments
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Comic styles are readable by all authenticated users
ALTER TABLE comic_styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY comic_styles_read_policy ON comic_styles
    FOR SELECT
    USING (auth.role() = 'authenticated');
