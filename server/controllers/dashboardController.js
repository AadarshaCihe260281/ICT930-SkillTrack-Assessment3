import supabase from "../config/db.js";

export async function dashboard(req, res) {
  const { data: enrollments, error: e1 } = await supabase.from("enrollments").select("progress").eq("user_id", req.user.id);
  if (e1) throw e1;
  const { count: completedLessons, error: e2 } = await supabase.from("lesson_progress").select("id", { count: "exact", head: true }).eq("user_id", req.user.id).eq("completed", true);
  if (e2) throw e2;
  const { count: completedCourses, error: e3 } = await supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("user_id", req.user.id).eq("completed", true);
  if (e3) throw e3;
  const { count: badges, error: e4 } = await supabase.from("user_achievements").select("id", { count: "exact", head: true }).eq("user_id", req.user.id);
  if (e4) throw e4;
  const { count: quizAttempts, error: e5 } = await supabase.from("quiz_results").select("id", { count: "exact", head: true }).eq("user_id", req.user.id);
  if (e5) throw e5;
  const overall = enrollments?.length ? Math.round(enrollments.reduce((s, e) => s + Number(e.progress), 0) / enrollments.length) : 0;
  res.json({ stats: { overall, completedCourses: completedCourses || 0, completedLessons: completedLessons || 0, badges: badges || 0, quizAttempts: quizAttempts || 0 } });
}
