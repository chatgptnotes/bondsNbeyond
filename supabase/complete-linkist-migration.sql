-- =====================================================
-- COMPLETE BONDS N BEYOND DATABASE MIGRATION SCRIPT
-- =====================================================
-- Run this script in your new Supabase project SQL Editor
-- to create an exact replica of the Bonds N Beyond database schema
-- =====================================================

-- =====================================================
-- STEP 1: ENABLE REQUIRED EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- =====================================================
-- STEP 2: CREATE UTILITY FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 3: CORE USER TABLES
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified BOOLEAN DEFAULT false,
  mobile_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  -- Founding member fields
  is_founding_member BOOLEAN DEFAULT false,
  founding_member_since TIMESTAMP WITH TIME ZONE,
  founding_member_plan TEXT CHECK (founding_member_plan IN ('lifetime', 'annual', 'monthly', NULL)),
  -- Country fields
  country TEXT,
  country_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_founding_member ON users(is_founding_member);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_unique ON users(phone_number) WHERE phone_number IS NOT NULL;

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Email OTPs table
CREATE TABLE IF NOT EXISTS email_otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  temp_user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_expires_at ON email_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_email_otps_temp_user_data ON email_otps USING GIN (temp_user_data);

-- Mobile OTPs table
CREATE TABLE IF NOT EXISTS mobile_otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mobile VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  temp_user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_otps_mobile ON mobile_otps(mobile);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_expires_at ON mobile_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_temp_user_data ON mobile_otps USING GIN (temp_user_data);

-- =====================================================
-- STEP 4: PROFILES SYSTEM
-- =====================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT,
  template TEXT,

  -- Basic Info
  first_name TEXT,
  last_name TEXT,
  title TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  profile_image_url TEXT,

  -- Professional Info
  company TEXT,
  position TEXT,
  skills TEXT[],
  job_title VARCHAR(200),
  company_name VARCHAR(200),
  company_website TEXT,
  company_address TEXT,
  company_logo_url TEXT,
  industry VARCHAR(100),
  sub_domain VARCHAR(100),
  professional_summary TEXT,
  profile_photo_url TEXT,
  background_image_url TEXT,

  -- Social & Links
  social_links JSONB DEFAULT '{}',

  -- Media
  cover_image_url TEXT,
  gallery_urls TEXT[],
  document_urls TEXT[],

  -- Settings
  visibility TEXT DEFAULT 'public',
  custom_url TEXT UNIQUE,
  profile_url TEXT,
  theme TEXT DEFAULT 'light',
  allow_contact BOOLEAN DEFAULT true,
  show_analytics BOOLEAN DEFAULT false,
  display_settings JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',

  -- Contact
  primary_email VARCHAR(255),
  mobile_number VARCHAR(20),
  whatsapp_number VARCHAR(20),

  -- Metadata
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_email ON profiles(user_email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_profiles_custom_url ON profiles(custom_url);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_url ON profiles(profile_url);
CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON profiles(industry);

-- Profile Users junction table
CREATE TABLE IF NOT EXISTS profile_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_profile_user UNIQUE (profile_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_users_profile_id ON profile_users(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_users_user_id ON profile_users(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_users_created_at ON profile_users(created_at);

-- Profile Experience
CREATE TABLE IF NOT EXISTS profile_experience (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT,
  position TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  is_current BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_experience_profile_id ON profile_experience(profile_id);

-- Profile Education
CREATE TABLE IF NOT EXISTS profile_education (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution TEXT,
  degree TEXT,
  field TEXT,
  graduation_year TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_education_profile_id ON profile_education(profile_id);

-- Profile Services
CREATE TABLE IF NOT EXISTS profile_services (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pricing TEXT,
  currency TEXT DEFAULT 'USD',
  pricing_unit TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_services_profile_id ON profile_services(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_services_category ON profile_services(category);
CREATE INDEX IF NOT EXISTS idx_profile_services_is_active ON profile_services(is_active);

-- Profile Analytics
CREATE TABLE IF NOT EXISTS profile_analytics (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  visitor_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_analytics_profile_id ON profile_analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_analytics_event_type ON profile_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_profile_analytics_created_at ON profile_analytics(created_at);

-- Profile Link Clicks
CREATE TABLE IF NOT EXISTS profile_link_clicks (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  link_type TEXT,
  link_url TEXT,
  visitor_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_link_clicks_profile_id ON profile_link_clicks(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_link_clicks_link_type ON profile_link_clicks(link_type);

-- Profile Media
CREATE TABLE IF NOT EXISTS profile_media (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  mime_type TEXT,
  folder TEXT DEFAULT 'general',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_media_profile_id ON profile_media(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_media_user_email ON profile_media(user_email);
CREATE INDEX IF NOT EXISTS idx_profile_media_file_type ON profile_media(file_type);

-- Profile Templates
CREATE TABLE IF NOT EXISTS profile_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STEP 5: ORDER & PAYMENT TABLES
-- =====================================================

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'production', 'shipped', 'delivered', 'cancelled')),
  customer_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  card_config JSONB NOT NULL,
  shipping JSONB NOT NULL,
  pricing JSONB NOT NULL,
  emails_sent JSONB DEFAULT '{}',
  estimated_delivery VARCHAR(50),
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  proof_images TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- GDPR Consents
CREATE TABLE IF NOT EXISTS gdpr_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  consents JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gdpr_consents_email ON gdpr_consents(email);

-- Vouchers
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  min_order_value NUMERIC DEFAULT 0,
  max_discount_amount NUMERIC,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  user_limit INTEGER DEFAULT 1,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON vouchers(is_active);

-- Voucher Usage
CREATE TABLE IF NOT EXISTS voucher_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voucher_id UUID REFERENCES vouchers(id) ON DELETE CASCADE,
  user_id UUID,
  user_id_from_users UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT,
  order_id UUID,
  discount_amount NUMERIC NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voucher_usage_user_id ON voucher_usage(user_id_from_users);
CREATE INDEX IF NOT EXISTS idx_voucher_usage_email ON voucher_usage(user_email);
CREATE INDEX IF NOT EXISTS idx_voucher_usage_voucher_user ON voucher_usage(voucher_id, user_id_from_users);

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('physical-digital', 'digital-with-app', 'digital-only')),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  gst_percentage DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
  vat_percentage DECIMAL(5, 2) NOT NULL DEFAULT 5.00,
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
  popular BOOLEAN NOT NULL DEFAULT false,
  allowed_countries JSONB NOT NULL DEFAULT '["India", "UAE", "USA", "UK"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_plans_status ON subscription_plans(status);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_type ON subscription_plans(type);

-- =====================================================
-- STEP 6: ADMIN SYSTEM TABLES
-- =====================================================

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'manager', 'support', 'viewer')),
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_super_admin BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip INET,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Admin Sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Admin Activity Logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_user ON admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created ON admin_activity_logs(created_at DESC);

-- User Profiles (extended user data)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(200),
  job_title VARCHAR(100),
  bio TEXT,
  website VARCHAR(255),
  social_links JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  tags TEXT[],
  is_vip BOOLEAN DEFAULT false,
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES product_categories(id),
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  weight DECIMAL(10,3),
  dimensions JSONB,
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Inventory Movements
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('purchase', 'sale', 'return', 'adjustment', 'transfer', 'damage', 'loss')),
  quantity INT NOT NULL,
  unit_cost DECIMAL(10,2),
  reference_type VARCHAR(50),
  reference_id UUID,
  notes TEXT,
  performed_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_movements(product_id);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,
  product_sku VARCHAR(100),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  customization JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Order Status History
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);

-- Order Notes
CREATE TABLE IF NOT EXISTS order_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  is_customer_visible BOOLEAN DEFAULT false,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMS Pages
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  content_json JSONB,
  template VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image VARCHAR(500),
  category VARCHAR(100),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft',
  views_count INT DEFAULT 0,
  author_id UUID REFERENCES admin_users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT,
  text_content TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Campaigns
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  template_id UUID REFERENCES email_templates(id),
  from_name VARCHAR(100),
  from_email VARCHAR(255),
  reply_to VARCHAR(255),
  html_content TEXT,
  text_content TEXT,
  segment_filters JSONB,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  open_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  bounce_count INT DEFAULT 0,
  unsubscribe_count INT DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);

-- Email Campaign Recipients
CREATE TABLE IF NOT EXISTS email_campaign_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON email_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_email ON email_campaign_recipients(email);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(200),
  subject VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  assigned_to UUID REFERENCES admin_users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_number ON support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);

-- Ticket Messages
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'admin', 'system')),
  sender_id UUID,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_internal_note BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_category VARCHAR(50),
  event_action VARCHAR(100),
  event_label VARCHAR(255),
  event_value DECIMAL(10,2),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  page_url TEXT,
  referrer_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(2),
  city VARCHAR(100),
  properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);

-- Dashboard Metrics
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type VARCHAR(50) NOT NULL,
  period VARCHAR(20) NOT NULL,
  value JSONB NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(metric_type, period)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_id, is_read) WHERE is_read = false;

-- File Uploads
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  mime_type VARCHAR(100),
  size_bytes BIGINT,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  entity_type VARCHAR(50),
  entity_id UUID,
  uploaded_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50),
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- =====================================================
-- STEP 7: TRIGGERS
-- =====================================================

-- Users updated_at trigger
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Orders updated_at trigger
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profiles updated_at trigger
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profile services updated_at trigger
CREATE TRIGGER update_profile_services_updated_at BEFORE UPDATE ON profile_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vouchers updated_at trigger
CREATE TRIGGER update_vouchers_updated_at BEFORE UPDATE ON vouchers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Subscription plans updated_at trigger
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Admin users updated_at trigger
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User profiles updated_at trigger
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Products updated_at trigger
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Product categories updated_at trigger
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS pages updated_at trigger
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blog posts updated_at trigger
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Email templates updated_at trigger
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Email campaigns updated_at trigger
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Support tickets updated_at trigger
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- System settings updated_at trigger
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 8: HELPER FUNCTIONS
-- =====================================================

-- Function to clean expired OTPs
CREATE OR REPLACE FUNCTION clean_expired_otps()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
  temp_count INTEGER := 0;
BEGIN
  DELETE FROM email_otps WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  DELETE FROM mobile_otps WHERE expires_at < NOW();
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check founding member eligibility
CREATE OR REPLACE FUNCTION is_founding_member_eligible(user_created_at TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN AS $$
DECLARE
  launch_date TIMESTAMP WITH TIME ZONE;
  end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT (value::text)::timestamp with time zone INTO launch_date
  FROM system_settings WHERE key = 'founding_member_launch_date';
  SELECT (value::text)::timestamp with time zone INTO end_date
  FROM system_settings WHERE key = 'founding_member_end_date';
  RETURN user_created_at >= launch_date AND user_created_at <= end_date;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has used a voucher
CREATE OR REPLACE FUNCTION has_user_used_voucher(
  p_voucher_code TEXT,
  p_user_email TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_voucher_id UUID;
  v_usage_count INTEGER;
BEGIN
  SELECT id INTO v_voucher_id FROM vouchers WHERE code = p_voucher_code;
  IF v_voucher_id IS NULL THEN RETURN FALSE; END IF;
  SELECT COUNT(*) INTO v_usage_count FROM voucher_usage
  WHERE voucher_id = v_voucher_id
    AND ((p_user_email IS NOT NULL AND user_email = p_user_email)
      OR (p_user_id IS NOT NULL AND user_id_from_users = p_user_id));
  RETURN v_usage_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to get user from profile
CREATE OR REPLACE FUNCTION get_user_from_profile(p_profile_id UUID)
RETURNS UUID AS $$
DECLARE v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id FROM profile_users WHERE profile_id = p_profile_id LIMIT 1;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get profile from user
CREATE OR REPLACE FUNCTION get_profile_from_user(p_user_id UUID)
RETURNS UUID AS $$
DECLARE v_profile_id UUID;
BEGIN
  SELECT profile_id INTO v_profile_id FROM profile_users WHERE user_id = p_user_id LIMIT 1;
  RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Auto-link profile to user trigger function
CREATE OR REPLACE FUNCTION auto_link_profile_to_user()
RETURNS TRIGGER AS $$
DECLARE v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(NEW.email)) LIMIT 1;
  IF v_user_id IS NOT NULL THEN
    INSERT INTO profile_users (profile_id, user_id) VALUES (NEW.id, v_user_id)
    ON CONFLICT (profile_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_link_profile ON profiles;
CREATE TRIGGER trigger_auto_link_profile AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION auto_link_profile_to_user();

-- Auto-link user to profile trigger function
CREATE OR REPLACE FUNCTION auto_link_user_to_profile()
RETURNS TRIGGER AS $$
DECLARE v_profile_id UUID;
BEGIN
  SELECT id INTO v_profile_id FROM profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM(NEW.email)) LIMIT 1;
  IF v_profile_id IS NOT NULL THEN
    INSERT INTO profile_users (profile_id, user_id) VALUES (v_profile_id, NEW.id)
    ON CONFLICT (profile_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_link_user ON users;
CREATE TRIGGER trigger_auto_link_user AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION auto_link_user_to_profile();

-- =====================================================
-- STEP 9: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid()::text = id::text AND status = 'active');
CREATE POLICY users_update_own ON users FOR UPDATE USING (auth.uid()::text = id::text AND status = 'active');
CREATE POLICY users_service_role_all ON users FOR ALL TO service_role USING (true) WITH CHECK (true);

-- OTP policies (allow anonymous access for verification flow)
CREATE POLICY "Allow anonymous access to email OTPs" ON email_otps FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to mobile OTPs" ON mobile_otps FOR ALL USING (true);

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Service role full access to profiles" ON profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Profile services policies
CREATE POLICY "Users can view services on profiles" ON profile_services FOR SELECT USING (true);
CREATE POLICY "Service role full access to profile_services" ON profile_services FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (email = auth.jwt() ->> 'email');
CREATE POLICY "Allow anonymous order creation" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can manage all orders" ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Admin policies
CREATE POLICY "Admin full access" ON admin_users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin sessions access" ON admin_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Products policies
CREATE POLICY "Products public read" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Products admin write" ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

-- General service role access for all tables
CREATE POLICY "Service role access" ON user_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON profile_users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON profile_experience FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON profile_education FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON profile_analytics FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON profile_link_clicks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON profile_media FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON gdpr_consents FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON vouchers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON voucher_usage FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON admin_activity_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON user_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON product_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON inventory_movements FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON order_items FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON order_status_history FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON cms_pages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON blog_posts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON email_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON email_campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON email_campaign_recipients FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON support_tickets FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON ticket_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON analytics_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON dashboard_metrics FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON notifications FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON file_uploads FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON system_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON subscription_plans FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON profile_templates FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =====================================================
-- STEP 10: STORAGE BUCKETS
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('background-images', 'background-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('card-assets', 'card-assets', true) ON CONFLICT DO NOTHING;

-- Storage policies for profile-photos
CREATE POLICY "Public Access for profile photos" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Authenticated users can upload profile photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos');
CREATE POLICY "Users can update profile photos" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-photos');
CREATE POLICY "Users can delete profile photos" ON storage.objects FOR DELETE USING (bucket_id = 'profile-photos');

-- Storage policies for company-logos
CREATE POLICY "Public Access for company logos" ON storage.objects FOR SELECT USING (bucket_id = 'company-logos');
CREATE POLICY "Authenticated users can upload company logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'company-logos');
CREATE POLICY "Users can update company logos" ON storage.objects FOR UPDATE USING (bucket_id = 'company-logos');
CREATE POLICY "Users can delete company logos" ON storage.objects FOR DELETE USING (bucket_id = 'company-logos');

-- Storage policies for background-images
CREATE POLICY "Public Access for background images" ON storage.objects FOR SELECT USING (bucket_id = 'background-images');
CREATE POLICY "Authenticated users can upload background images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'background-images');
CREATE POLICY "Users can update background images" ON storage.objects FOR UPDATE USING (bucket_id = 'background-images');
CREATE POLICY "Users can delete background images" ON storage.objects FOR DELETE USING (bucket_id = 'background-images');

-- Storage policies for card-assets
CREATE POLICY "Public Access for card assets" ON storage.objects FOR SELECT USING (bucket_id = 'card-assets');
CREATE POLICY "Authenticated users can upload card assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'card-assets');
CREATE POLICY "Users can update card assets" ON storage.objects FOR UPDATE USING (bucket_id = 'card-assets');
CREATE POLICY "Users can delete card assets" ON storage.objects FOR DELETE USING (bucket_id = 'card-assets');

-- =====================================================
-- STEP 11: SEED DATA
-- =====================================================

-- Insert profile templates
INSERT INTO profile_templates (id, name, description, category, is_popular) VALUES
  ('professional', 'Professional', 'Perfect for business professionals and corporate networking', 'business', true),
  ('creative', 'Creative', 'Showcase your creative portfolio and artistic work', 'creative', false),
  ('developer', 'Developer', 'Display your coding projects and technical skills', 'tech', true),
  ('photographer', 'Photographer', 'Beautiful gallery layouts for your photography', 'creative', false),
  ('musician', 'Musician', 'Share your music and connect with fans', 'creative', false),
  ('influencer', 'Influencer', 'Perfect for social media personalities', 'social', true),
  ('minimal', 'Minimal', 'Clean and simple design for any purpose', 'general', false),
  ('custom', 'Custom', 'Start from scratch with a blank canvas', 'general', false)
ON CONFLICT (id) DO NOTHING;

-- Insert subscription plans
INSERT INTO subscription_plans (name, type, price, gst_percentage, vat_percentage, description, features, status, popular, allowed_countries) VALUES
  ('Physical Card + Digital Profile', 'physical-digital', 29.00, 18.00, 5.00, 'Premium NFC business card with digital profile',
   '["Premium NFC card", "Unlimited profile updates", "Analytics dashboard", "Custom branding", "Priority support"]'::jsonb,
   'active', false, '["India", "UAE", "USA", "UK"]'::jsonb),
  ('Digital Profile + App Access', 'digital-with-app', 19.00, 18.00, 5.00, 'Digital profile with mobile app access',
   '["Digital profile", "Mobile app access", "Profile analytics", "Custom design", "Email support"]'::jsonb,
   'active', true, '["India", "UAE", "USA", "UK"]'::jsonb),
  ('Free', 'digital-only', 9.00, 18.00, 5.00, 'Your professional identity - simple, shareable, sustainable.',
   '["Digital profile", "Basic analytics", "Profile customization", "Standard support"]'::jsonb,
   'active', false, '["India", "UAE", "USA", "UK"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert system settings
INSERT INTO system_settings (key, value, description, category, is_public) VALUES
  ('founding_member_launch_date', '"2024-10-15T00:00:00Z"'::jsonb, 'Launch date for founding member program', 'founding_member', false),
  ('founding_member_end_date', '"2025-04-15T00:00:00Z"'::jsonb, 'End date for founding member program', 'founding_member', false),
  ('site_name', '"Bonds N Beyond NFC Admin"'::jsonb, 'Site name', 'general', true),
  ('maintenance_mode', 'false'::jsonb, 'Maintenance mode status', 'general', true),
  ('order_prefix', '"ORD"'::jsonb, 'Order number prefix', 'orders', false),
  ('low_stock_threshold', '10'::jsonb, 'Low stock alert threshold', 'inventory', false),
  ('email_from_name', '"Bonds N Beyond NFC"'::jsonb, 'Default from name for emails', 'email', false),
  ('email_from_address', '"noreply@linkist.com"'::jsonb, 'Default from email address', 'email', false)
ON CONFLICT (key) DO NOTHING;

-- Insert default admin user (password: admin123456 - CHANGE IN PRODUCTION!)
INSERT INTO admin_users (email, username, password_hash, first_name, last_name, role, is_super_admin, is_active)
VALUES ('admin@linkist.com', 'admin', 'admin123456', 'Super', 'Admin', 'super_admin', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert test user (password: admin123456)
INSERT INTO users (email, first_name, last_name, password_hash, role, email_verified, mobile_verified, status)
VALUES ('admin@linkist.com', 'Admin', 'User', 'admin123456', 'admin', true, true, 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert BONDS N BEYONDFM voucher
INSERT INTO vouchers (code, description, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, user_limit, valid_from, valid_until, is_active)
VALUES ('BONDS N BEYONDFM', 'Founding Member Exclusive Discount - Free 1 Year Subscription (up to $120 value)', 'percentage', 50, 0, 120, NULL, 1, '2024-10-15 00:00:00+00', '2025-04-15 00:00:00+00', true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  max_discount_amount = EXCLUDED.max_discount_amount,
  user_limit = EXCLUDED.user_limit,
  valid_from = EXCLUDED.valid_from,
  valid_until = EXCLUDED.valid_until,
  is_active = EXCLUDED.is_active;

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Your Bonds N Beyond database replica is now ready.
--
-- Next steps:
-- 1. Update your .env.local with the new Supabase credentials:
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_ANON_KEY
--    - SUPABASE_SERVICE_ROLE_KEY
-- 2. Restart your dev server: npm run dev
-- =====================================================

SELECT 'Bonds N Beyond database migration completed successfully!' as status;
