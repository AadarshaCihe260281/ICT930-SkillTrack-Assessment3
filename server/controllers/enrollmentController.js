import supabase from "../config/db.js";

async function courseFor(courseId) {
  const { data: row, error } = await supabase.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (error) throw error;
  if (!row) return null;
  const { data: allEnrollments, error: countError } = await supabase.from("enrollments").select("id").eq("course_id", courseId);
  if (countError) throw countError;
  const { data: lessons, error: lessonError } = await supabase.from("lessons").select("title").eq("course_id", courseId).order("lesson_order", { ascending: true });
  if (lessonError) throw lessonError;
  return {
    id: row.id, title: row.title, description: row.description, category: row.category,
    instructor: row.instructor, difficulty: row.level, duration: row.duration,
    rating: Number(row.rating || 0), students: allEnrollments?.length || 0,
    image: row.image_url || "/skilltrack-logo.png", skills: row.skills || [],
    lessons: (lessons || []).map(l => l.title)
  };
}

async function enrollmentFor(userId, courseId) {
  const { data, error } = await supabase.from("enrollments").select("*").eq("user_id", userId).eq("course_id", courseId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function mine(req, res) {
  const { data: rows, error } = await supabase.from("enrollments")
    .select("id,user_id,course_id,progress,enrolled_at,completed_at,completed")
    .eq("user_id", req.user.id)
    .order("enrolled_at", { ascending: false });
  if (error) throw error;
  const enrollments = [];
  for (const row of rows || []) {
    const course = await courseFor(row.course_id);
    const { data: progressRows, error: progressError } = await supabase.from("lesson_progress")
      .select("lesson_id,completed,lessons!inner(title,course_id,lesson_order)")
      .eq("user_id", req.user.id).eq("completed", true).eq("lessons.course_id", row.course_id)
      .order("lesson_order", { referencedTable: "lessons", ascending: true });
    if (progressError) throw progressError;
    enrollments.push({
      id: row.id, user: row.user_id, course,
      completedLessons: (progressRows || []).map(p => p.lessons.title),
      progress: Number(row.progress), enrolledAt: row.enrolled_at, completedAt: row.completed_at
    });
  }
  res.json({ enrollments });
}

export async function enroll(req, res) {
  const { courseId } = req.body || {};
  if (!courseId) return res.status(400).json({ message: "courseId is required." });
  const course = await courseFor(courseId);
  if (!course) return res.status(404).json({ message: "Course not found." });
  if (await enrollmentFor(req.user.id, courseId)) return res.status(409).json({ message: "You are already enrolled in this course." });
  const { data, error } = await supabase.from("enrollments").insert({ user_id: req.user.id, course_id: courseId }).select("*").single();
  if (error) throw error;
  res.status(201).json({ enrollment: { id: data.id, course, completedLessons: [], progress: 0 } });
}

export async function progress(req, res) {
  const courseId = Number(req.params.courseId);
  const { lesson } = req.body || {};
  if (!lesson) return res.status(400).json({ message: "lesson is required." });
  const enrollment = await enrollmentFor(req.user.id, courseId);
  if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });

  const { data: lessonRow, error: lessonError } = await supabase.from("lessons").select("id").eq("course_id", courseId).eq("title", lesson).maybeSingle();
  if (lessonError) throw lessonError;
  if (!lessonRow) return res.status(404).json({ message: "Lesson not found." });

  const { data: existing, error: existingError } = await supabase.from("lesson_progress").select("id,completed").eq("user_id", req.user.id).eq("lesson_id", lessonRow.id).maybeSingle();
  if (existingError) throw existingError;

  if (existing) {
    const completed = !existing.completed;
    const { error } = await supabase.from("lesson_progress").update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("lesson_progress").insert({ user_id: req.user.id, lesson_id: lessonRow.id, completed: true, completed_at: new Date().toISOString() });
    if (error) throw error;
  }

  const { data: courseLessons, error: totalError } = await supabase.from("lessons").select("id").eq("course_id", courseId);
  if (totalError) throw totalError;
  const lessonIds = (courseLessons || []).map(l => l.id);
  const { data: doneRows, error: doneError } = lessonIds.length
    ? await supabase.from("lesson_progress").select("lesson_id").eq("user_id", req.user.id).eq("completed", true).in("lesson_id", lessonIds)
    : { data: [], error: null };
  if (doneError) throw doneError;

  const total = courseLessons?.length || 1;
  const done = doneRows?.length || 0;
  const pct = Math.round(done / total * 100);
  const completedAt = pct === 100 ? new Date().toISOString() : null;
  const { error: enrollmentError } = await supabase.from("enrollments").update({ progress: pct, completed: pct === 100, completed_at: completedAt }).eq("id", enrollment.id);
  if (enrollmentError) throw enrollmentError;

  if (pct === 100) {
    const code = `ST-${req.user.id}-${courseId}-${Date.now()}`;
    const { data: existingCert, error: certLookupError } = await supabase.from("certificates").select("id").eq("user_id", req.user.id).eq("course_id", courseId).maybeSingle();
    if (certLookupError) throw certLookupError;
    if (!existingCert) {
      const { error } = await supabase.from("certificates").insert({ certificate_code: code, user_id: req.user.id, course_id: courseId });
      if (error) throw error;
    }
  }

  const { data: achievementRows, error: achievementError } = await supabase.from("achievements").select("id,name");
  if (achievementError) throw achievementError;
  const { count: quizCount, error: quizCountError } = await supabase.from("quiz_results").select("id", { count: "exact", head: true }).eq("user_id", req.user.id);
  if (quizCountError) throw quizCountError;
  const { count: completedCount, error: completedCountError } = await supabase.from("lesson_progress").select("id", { count: "exact", head: true }).eq("user_id", req.user.id).eq("completed", true);
  if (completedCountError) throw completedCountError;

  for (const achievement of achievementRows || []) {
    const unlocked =
      achievement.name === "First Enrolment" ||
      (achievement.name === "First Lesson" && (completedCount || 0) >= 1) ||
      (achievement.name === "Quiz Starter" && (quizCount || 0) >= 1) ||
      (achievement.name === "Course Completed" && pct === 100) ||
      (achievement.name === "Learning Streak" && (completedCount || 0) >= 3);
    if (unlocked) {
      await supabase.from("user_achievements").upsert({ user_id: req.user.id, achievement_id: achievement.id }, { onConflict: "user_id,achievement_id", ignoreDuplicates: true });
    }
  }

  const { data: progressRows, error: progressError } = await supabase.from("lesson_progress")
    .select("lesson_id,completed,lessons!inner(title,course_id,lesson_order)")
    .eq("user_id", req.user.id).eq("completed", true).eq("lessons.course_id", courseId)
    .order("lesson_order", { referencedTable: "lessons", ascending: true });
  if (progressError) throw progressError;
  res.json({ enrollment: { id: enrollment.id, course: await courseFor(courseId), completedLessons: (progressRows || []).map(p => p.lessons.title), progress: pct } });
}
