
-- 1. Fix privilege escalation on user_roles
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
CREATE POLICY "Users can self-assign non-admin roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role IN ('donor'::app_role, 'ngo'::app_role, 'volunteer'::app_role)
);

-- 2. Restrict profiles insert to authenticated only
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Fix alerts insert to scope to own user_id
DROP POLICY IF EXISTS "Authenticated users can insert alerts" ON public.alerts;
CREATE POLICY "Users can insert own alerts"
ON public.alerts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own alerts" ON public.alerts;
CREATE POLICY "Users update own alerts"
ON public.alerts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users view own alerts" ON public.alerts;
CREATE POLICY "Users view own alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 4. Restrict impact_logs - authenticated insert + own rows only
DROP POLICY IF EXISTS "Users can insert own impact" ON public.impact_logs;
CREATE POLICY "Users can insert own impact"
ON public.impact_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone authenticated can view impact" ON public.impact_logs;
CREATE POLICY "Users can view own impact"
ON public.impact_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 5. Lock down SECURITY DEFINER helpers from direct client execution
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- has_role is referenced in RLS policies; keep callable to authenticated only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;

-- 6. Storage: restrict food-images uploads to user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload food images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload food images" ON storage.objects;
CREATE POLICY "Users upload food images to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'food-images'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);
