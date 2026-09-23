import supabase from "../config/db.js";

export async function mine(req, res) {
  const { data, error } = await supabase.from("certificates")
    .select("id,certificate_code,user_id,course_id,issued_at,courses!inner(title,instructor)")
    .eq("user_id", req.user.id)
    .order("issued_at", { ascending: false });
  if (error) throw error;
  res.json({ certificates: data || [] });
}
