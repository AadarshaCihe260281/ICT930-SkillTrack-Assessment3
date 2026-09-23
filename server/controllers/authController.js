import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/db.js";

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, goal: u.goal });
const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export async function register(req, res) {
  const { name, email, password, goal } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "Name, email and password are required." });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

  const normalizedEmail = email.trim().toLowerCase();
  const { data: existing, error: lookupError } = await supabase.from("users").select("id").eq("email", normalizedEmail).limit(1);
  if (lookupError) throw lookupError;
  if (existing?.length) return res.status(409).json({ message: "An account with this email already exists." });

  const hash = await bcrypt.hash(password, 12);
  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password: hash,
    role: "student",
    goal: goal?.trim() || "Become a confident frontend developer"
  };
  const { data: created, error } = await supabase.from("users").insert(newUser).select("id,name,email,role,goal").single();
  if (error) throw error;
  res.status(201).json({ token: tokenFor(created.id), user: publicUser(created) });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  const { data: user, error } = await supabase.from("users").select("*").eq("email", (email || "").trim().toLowerCase()).limit(1).maybeSingle();
  if (error) throw error;
  if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password." });
  res.json({ token: tokenFor(user.id), user: publicUser(user) });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
