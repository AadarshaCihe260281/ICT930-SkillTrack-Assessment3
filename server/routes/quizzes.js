const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");

// GET /api/quizzes/:quizId
// Returns quiz questions without exposing the correct answers.
router.get("/:quizId", async (req, res) => {
  try {
    const quizId = Number(req.params.quizId);

    if (!Number.isInteger(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID.",
      });
    }

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, course_id, title, description, passing_score")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({
        message: "Quiz not found.",
      });
    }

    const { data: questions, error: questionError } = await supabase
      .from("quiz_questions")
      .select(
        "id, question, option_a, option_b, option_c, option_d, question_order"
      )
      .eq("quiz_id", quizId)
      .order("question_order", { ascending: true });

    if (questionError) {
      console.error(questionError);

      return res.status(500).json({
        message: "Failed to load quiz questions.",
      });
    }

    res.json({
      quiz,
      questions: questions || [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while loading quiz.",
    });
  }
});

module.exports = router;
// POST /api/quizzes/:quizId/submit
router.post("/:quizId/submit", async (req, res) => {
  try {
    const quizId = Number(req.params.quizId);
    const { userId, answers } = req.body;

    if (!Number.isInteger(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "User ID is required.",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be an array.",
      });
    }

    // Get quiz information
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, passing_score")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({
        message: "Quiz not found.",
      });
    }

    // Get correct answers from database
    const { data: questions, error: questionError } = await supabase
      .from("quiz_questions")
      .select("id, correct_option")
      .eq("quiz_id", quizId);

    if (questionError) {
      console.error(questionError);

      return res.status(500).json({
        message: "Failed to retrieve quiz answers.",
      });
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({
        message: "This quiz has no questions.",
      });
    }

    // Create a map of submitted answers
    const answerMap = new Map();

    answers.forEach((answer) => {
      if (answer.questionId && answer.selectedOption) {
        answerMap.set(
          Number(answer.questionId),
          String(answer.selectedOption).toUpperCase()
        );
      }
    });

    // Calculate score
    let correctCount = 0;

    questions.forEach((question) => {
      const submittedAnswer = answerMap.get(Number(question.id));

      if (
        submittedAnswer &&
        submittedAnswer === String(question.correct_option).toUpperCase()
      ) {
        correctCount++;
      }
    });

    const score = Math.round(
      (correctCount / questions.length) * 100
    );

    const passed = score >= Number(quiz.passing_score);

    // Save result
    const { data: result, error: resultError } = await supabase
      .from("quiz_results")
      .insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        passed,
      })
      .select("id, user_id, quiz_id, score, passed, attempted_at")
      .single();

    if (resultError) {
      console.error(resultError);

      return res.status(500).json({
        message: "Failed to save quiz result.",
        error: resultError.message,
      });
    }

    res.json({
      message: "Quiz submitted successfully.",
      result: {
        ...result,
        correctCount,
        totalQuestions: questions.length,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while submitting quiz.",
    });
  }
});

module.exports = router;