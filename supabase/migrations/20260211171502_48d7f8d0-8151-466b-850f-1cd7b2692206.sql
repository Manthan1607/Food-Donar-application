
-- Fix the permissive alerts INSERT policy
DROP POLICY "Insert alerts" ON public.alerts;
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
