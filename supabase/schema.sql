-- supabase/schema.sql

-- 1. Create Orders table
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  postal_code text,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'IRT',
  status text NOT NULL DEFAULT 'pending',
  whatsapp_sent boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);

-- 2. Create Visits table
CREATE TABLE public.visits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page text NOT NULL,
  device_type text,
  browser text,
  country text,
  ip_hash text,
  visited_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT visits_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- General users cannot read, update, or delete orders.
-- They can ONLY insert orders via the Edge Function (which bypasses RLS using the Service Role Key).
-- If we want to allow direct client insert (NOT recommended since we want edge function):
-- CREATE POLICY "Allow anonymous inserts" ON public.orders FOR INSERT TO anon WITH CHECK (true);
-- However, since you specified using Edge Functions, we leave RLS empty for anon to block direct access.

-- Same for visits: only edge function can insert.
