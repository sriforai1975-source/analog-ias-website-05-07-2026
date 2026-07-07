-- Staff helper (admin OR editor), private schema (not API-exposed)
CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated, service_role;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ page_content ============
CREATE TABLE public.page_content (
  page text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.page_content TO authenticated;
GRANT ALL ON public.page_content TO service_role;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page content" ON public.page_content
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff can insert page content" ON public.page_content
FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update page content" ON public.page_content
FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete page content" ON public.page_content
FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

CREATE TRIGGER page_content_updated_at BEFORE UPDATE ON public.page_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ courses ============
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses" ON public.courses
FOR SELECT TO anon, authenticated USING (is_published OR private.is_staff(auth.uid()));
CREATE POLICY "Staff can insert courses" ON public.courses
FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update courses" ON public.courses
FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete courses" ON public.courses
FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

CREATE TRIGGER courses_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ results ============
CREATE TABLE public.results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rank text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.results TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.results TO authenticated;
GRANT ALL ON public.results TO service_role;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published results" ON public.results
FOR SELECT TO anon, authenticated USING (is_published OR private.is_staff(auth.uid()));
CREATE POLICY "Staff can insert results" ON public.results
FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update results" ON public.results
FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete results" ON public.results
FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

CREATE TRIGGER results_updated_at BEFORE UPDATE ON public.results
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Seed page content ============
INSERT INTO public.page_content (page, data) VALUES
('home', '{
  "hero_eyebrow": "India''s Premier Civil Services Academy",
  "hero_title": "Building India''s Future Civil Servants",
  "hero_subtitle": "ANALOG IAS ACADEMY has guided thousands of aspirants towards Civil Services success through expert faculty and structured mentoring.",
  "stats": [
    {"value": "25+", "label": "Years Legacy"},
    {"value": "10,000+", "label": "Successful Students"},
    {"value": "500+", "label": "Selections"},
    {"value": "50+", "label": "Expert Faculty"}
  ],
  "why_title": "A Legacy of Excellence in Civil Services",
  "why_subtitle": "Everything you need to transform your preparation into a successful career in public service.",
  "cta_title": "Ready to begin your journey?",
  "cta_subtitle": "Join ANALOG IAS ACADEMY and take the first confident step towards becoming a civil servant."
}'::jsonb),
('about', '{
  "hero_title": "Shaping India''s Administrators for Over Two Decades",
  "hero_subtitle": "ANALOG IAS ACADEMY is a leading Civil Services institution committed to guiding aspirants towards success through expert faculty, structured mentoring and a proven methodology.",
  "story_title": "A Mission Rooted in Excellence",
  "story_p1": "For more than 25 years, ANALOG IAS ACADEMY has been a trusted name in Civil Services preparation. What began as a small mentoring initiative has grown into a premier academy that has produced hundreds of successful officers.",
  "story_p2": "Our philosophy is simple — put the student first. We combine rigorous academics with personalised guidance, ensuring every aspirant receives the attention they deserve.",
  "values": [
    "Structured, syllabus-aligned curriculum",
    "Comprehensive test series and evaluation",
    "Up-to-date current affairs coverage",
    "Small batches for focused attention",
    "Doubt-clearing and one-on-one mentoring",
    "Motivational and disciplined environment"
  ]
}'::jsonb),
('courses', '{
  "hero_title": "Programmes for Every Stage of Your Journey",
  "hero_subtitle": "From foundation to final interview, our structured courses cover the complete Civil Services syllabus with expert guidance."
}'::jsonb),
('results', '{
  "hero_title": "Celebrating Our Achievers",
  "hero_subtitle": "Our students consistently secure top ranks in the Civil Services examinations — a proud reflection of their hard work and our guidance."
}'::jsonb),
('contact', '{
  "address": ["ANALOG IAS ACADEMY", "1-2-3 Ashok Nagar, Main Road", "Hyderabad, Telangana 500020"],
  "phone": ["+91 98765 43210", "+91 98765 43211"],
  "email": ["info@analogias.com", "admissions@analogias.com"],
  "hours": ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: Closed"],
  "map_embed_url": ""
}'::jsonb);

-- ============ Seed courses ============
INSERT INTO public.courses (title, description, icon, sort_order) VALUES
('UPSC Foundation', 'A complete two-year integrated programme covering the entire syllabus from basics to advanced, ideal for beginners.', 'BookOpen', 1),
('UPSC Prelims', 'Focused preparation with concept clarity, current affairs and extensive test series to crack the preliminary exam.', 'ClipboardList', 2),
('UPSC Mains', 'Answer-writing mastery, structured notes and personalised evaluation to excel in the descriptive main examination.', 'PenLine', 3),
('Interview Guidance', 'Mock interviews with expert panels, personality development and DAF analysis to shine in the final stage.', 'MessageSquare', 4),
('Optional Subjects', 'Specialised coaching across popular optionals with dedicated faculty, standard materials and regular tests.', 'Layers', 5),
('State PSC Courses', 'Tailored programmes for state civil services with region-specific content, exam patterns and mentoring.', 'Landmark', 6);

-- ============ Seed results ============
INSERT INTO public.results (name, rank, year, sort_order) VALUES
('Ananya Sharma', 'AIR 12', '2024', 1),
('Rahul Verma', 'AIR 27', '2024', 2),
('Priya Nair', 'AIR 45', '2023', 3),
('Karthik Reddy', 'AIR 58', '2023', 4),
('Sneha Iyer', 'AIR 63', '2023', 5),
('Aditya Rao', 'AIR 71', '2022', 6),
('Meera Krishnan', 'AIR 89', '2022', 7),
('Vikram Singh', 'AIR 104', '2022', 8);