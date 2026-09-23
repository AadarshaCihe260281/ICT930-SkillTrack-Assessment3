import supabase from "../config/db.js";

function parseCourse(row, lessons = []) {
  let skills = row.skills || [];
  if (typeof skills === "string") {
    try { skills = JSON.parse(skills); } catch { skills = skills.split(",").map(s => s.trim()).filter(Boolean); }
  }
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    instructor: row.instructor,
    difficulty: row.level || row.difficulty,
    duration: row.duration,
    rating: Number(row.rating || 0),
    students: Number(row.students || 0),
    image: row.image_url || row.image || "/skilltrack-logo.png",
    skills: Array.isArray(skills) ? skills : [],
    lessons: lessons.map(l => l.title)
  };
}

async function hydrateCourses(rows) {
  if (!rows.length) return [];
  const ids = rows.map(r => r.id);
  const { data: lessonRows, error } = await supabase
    .from("lessons")
    .select("id,course_id,title,lesson_order")
    .in("course_id", ids)
    .order("course_id", { ascending: true })
    .order("lesson_order", { ascending: true });
  if (error) throw error;
  const grouped = new Map();
  (lessonRows || []).forEach(l => {
    if (!grouped.has(l.course_id)) grouped.set(l.course_id, []);
    grouped.get(l.course_id).push(l);
  });
  return rows.map(r => parseCourse(r, grouped.get(r.id) || []));
}

async function withStudentCounts(rows) {
  if (!rows.length) return [];
  const ids = rows.map(r => r.id);
  const { data: enrollments, error } = await supabase.from("enrollments").select("course_id").in("course_id", ids);
  if (error) throw error;
  const counts = new Map();
  (enrollments || []).forEach(e => counts.set(e.course_id, (counts.get(e.course_id) || 0) + 1));
  return rows.map(r => ({ ...r, students: counts.get(r.id) || 0 }));
}

export async function list(req, res) {
  let query = supabase.from("courses").select("*").order("created_at", { ascending: false });
  if (req.query.category && req.query.category !== "All") query = query.eq("category", req.query.category);
  if (req.query.difficulty && req.query.difficulty !== "All") query = query.eq("level", req.query.difficulty);
  if (req.query.search) {
    const s = req.query.search.trim();
    query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%,category.ilike.%${s}%`);
  }
  const { data: rows, error } = await query;
  if (error) throw error;
  res.json({ courses: await hydrateCourses(await withStudentCounts(rows || [])) });
}

export async function getOne(req, res) {
  const { data: row, error } = await supabase.from("courses").select("*").eq("id", req.params.id).maybeSingle();
  if (error) throw error;
  if (!row) return res.status(404).json({ message: "Course not found." });
  const [course] = await hydrateCourses(await withStudentCounts([row]));
  res.json({ course });
}

function validate(body) {
  const required = ["title", "description", "category", "instructor", "difficulty", "duration"];
  return required.filter(k => !body?.[k]?.toString().trim());
}

function coursePayload(b) {
  return {
    title: b.title.trim(),
    description: b.description.trim(),
    category: b.category,
    instructor: b.instructor.trim(),
    level: b.difficulty,
    duration: b.duration,
    rating: Number(b.rating || 0),
    image_url: b.image || "/skilltrack-logo.png",
    skills: Array.isArray(b.skills) ? b.skills : String(b.skills || "").split(",").map(s => s.trim()).filter(Boolean)
  };
}

async function replaceLessons(courseId, lessons = []) {
  const { error: deleteError } = await supabase.from("lessons").delete().eq("course_id", courseId);
  if (deleteError) throw deleteError;
  const rows = lessons.map((lesson, i) => ({
    course_id: courseId,
    title: typeof lesson === "string" ? lesson.trim() : lesson?.title?.trim(),
    lesson_order: i + 1
  })).filter(l => l.title);
  if (rows.length) {
    const { error } = await supabase.from("lessons").insert(rows);
    if (error) throw error;
  }
}

export async function create(req, res) {
  const missing = validate(req.body);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
  const { data: row, error } = await supabase.from("courses").insert(coursePayload(req.body)).select("*").single();
  if (error) throw error;
  await replaceLessons(row.id, req.body.lessons || []);
  const [course] = await hydrateCourses([row]);
  res.status(201).json({ course });
}

export async function update(req, res) {
  const missing = validate(req.body);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
  const { data: row, error } = await supabase.from("courses").update(coursePayload(req.body)).eq("id", req.params.id).select("*").maybeSingle();
  if (error) throw error;
  if (!row) return res.status(404).json({ message: "Course not found." });
  await replaceLessons(req.params.id, req.body.lessons || []);
  const [course] = await hydrateCourses([row]);
  res.json({ course });
}

export async function remove(req, res) {
  const { data: row, error } = await supabase.from("courses").delete().eq("id", req.params.id).select("id").maybeSingle();
  if (error) throw error;
  if (!row) return res.status(404).json({ message: "Course not found." });
  res.json({ message: "Course deleted." });
}
