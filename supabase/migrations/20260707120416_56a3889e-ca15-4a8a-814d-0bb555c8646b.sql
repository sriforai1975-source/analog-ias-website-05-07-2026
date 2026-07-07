-- 1. Private schema not exposed via the Data API
CREATE SCHEMA IF NOT EXISTS private;

-- 2. Recreate the role-check helper inside the private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Allow RLS evaluation for signed-in users and server-side admin ops
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3. Recreate contact_submissions policies to use the private helper
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view submissions" ON public.contact_submissions
FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update submissions" ON public.contact_submissions
FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete submissions" ON public.contact_submissions
FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. Remove the publicly executable version
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);