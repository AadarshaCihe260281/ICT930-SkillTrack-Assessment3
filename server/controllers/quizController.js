import supabase from "../config/db.js";

async function getQuizById(quizId) {
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id,course_id,title,description,passing_score")
    .eq("id", quizId)
    .maybeSingle();

  if (quizError) throw quizError;

  if (!quiz) return null;

  const { data: questions, error: questionError } = await supabase
    .from("quiz_questions")
    .select(
      "id,question,option_a,option_b,option_c,option_d,correct_option,question_order"
    )
    .eq("quiz_id", quizId)
    .order("question_order", { ascending: true });

  if (questionError) throw questionError;

  return {
    quiz,
    questions: questions || [],
  };
}


// GET /api/quiz
// Loads the first available quiz.
export async function getQuiz(req, res) {
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("id")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (!quiz) {
    return res.status(404).json({
      message: "No quiz is available.",
    });
  }

  const payload = await getQuizById(quiz.id);

  if (!payload?.questions.length) {
    return res.status(404).json({
      message: "No quiz is available.",
    });
  }

  res.json({
    quiz: {
      id: payload.quiz.id,
      courseId: payload.quiz.course_id,
      title: payload.quiz.title,
      description: payload.quiz.description,
      passingScore: payload.quiz.passing_score,
    },

    questions: payload.questions.map((q) => ({
      id: q.id,
      question: q.question,

      options: [
        {
          key: "A",
          text: q.option_a,
        },
        {
          key: "B",
          text: q.option_b,
        },
        {
          key: "C",
          text: q.option_c,
        },
        {
          key: "D",
          text: q.option_d,
        },
      ].filter((option) => option.text),
    })),
  });
}


// POST /api/quiz/submit
export async function submit(req, res) {
  const answers = Array.isArray(req.body?.answers)
    ? req.body.answers
    : [];

  if (answers.length === 0) {
    return res.status(400).json({
      message: "Please answer at least one question.",
    });
  }

  // Get the first available quiz.
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (quizError) throw quizError;

  if (!quiz) {
    return res.status(404).json({
      message: "No quiz is available.",
    });
  }

  const payload = await getQuizById(quiz.id);

  if (!payload?.questions.length) {
    return res.status(404).json({
      message: "No quiz is available.",
    });
  }

  let correctCount = 0;

  payload.questions.forEach((question, index) => {
    const submittedAnswer = String(
      answers[index] || ""
    ).toUpperCase();

    const correctAnswer = String(
      question.correct_option || ""
    ).toUpperCase();

    if (submittedAnswer === correctAnswer) {
      correctCount++;
    }
  });

  const totalQuestions = payload.questions.length;

  const percentage = Math.round(
    (correctCount / totalQuestions) * 100
  );

  const passingScore = Number(
    payload.quiz.passing_score || 60
  );

  const passed = percentage >= passingScore;

  // Save result to Supabase.
  const { data, error } = await supabase
    .from("quiz_results")
    .insert({
      user_id: req.user.id,
      quiz_id: payload.quiz.id,
      score: percentage,
      passed,
    })
    .select("*")
    .single();

  if (error) throw error;

  res.status(201).json({
    message: "Quiz submitted successfully.",

    result: {
      id: data.id,
      score: correctCount,
      total: totalQuestions,
      percentage,
      passed,
      passingScore,
      attemptedAt: data.attempted_at,
    },
  });
}


// GET /api/quiz/results
export async function myResults(req, res) {
  const { data, error } = await supabase
    .from("quiz_results")
    .select(
      "id,quiz_id,score,passed,attempted_at"
    )
    .eq("user_id", req.user.id)
    .order("attempted_at", {
      ascending: false,
    });

  if (error) throw error;

  res.json({
    results: data || [],
  });
}