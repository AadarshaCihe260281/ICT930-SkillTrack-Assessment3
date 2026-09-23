import "dotenv/config";
import bcrypt from "bcryptjs";
import supabase from "../config/db.js";
import courses from "../../src/data/courses.json" with { type: "json" };

const password = await bcrypt.hash("Admin123!", 12);

const { error: adminError } = await supabase.from("users").upsert({
  name: "SkillTrack Admin",
  email: "admin@skilltrack.local",
  password,
  role: "admin",
  goal: "Manage the SkillTrack learning platform"
}, { onConflict: "email" });
if (adminError) throw adminError;

for (const course of courses) {
  const { error: courseError } = await supabase.from("courses").upsert({
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    instructor: course.instructor,
    level: course.difficulty,
    duration: course.duration,
    rating: Number(course.rating || 0),
    image_url: course.image || "/skilltrack-logo.png",
    skills: course.skills || []
  }, { onConflict: "id" });
  if (courseError) throw courseError;

  const { error: deleteError } = await supabase.from("lessons").delete().eq("course_id", course.id);
  if (deleteError) throw deleteError;
  const lessons = (course.lessons || []).map((title, i) => ({ course_id: course.id, title, lesson_order: i + 1 }));
  if (lessons.length) {
    const { error: lessonError } = await supabase.from("lessons").insert(lessons);
    if (lessonError) throw lessonError;
  }
}

if (courses.length) {
  const maxId = Math.max(...courses.map(c => Number(c.id)));
  // Keep PostgreSQL's identity sequence ahead of seeded numeric IDs.
  const { error } = await supabase.rpc("set_course_sequence", { next_value: maxId + 1 });
  if (error) throw error;
}

console.log(`Seeded ${courses.length} courses and admin account.`);
