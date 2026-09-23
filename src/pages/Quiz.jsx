import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/ui/Modal";
import { quizApi } from "../services/api";

export default function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await quizApi.get();

        setQuiz(data.quiz);
        setQuestions(data.questions || []);
      } catch (e) {
        setError(e.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, []);

  const complete =
    questions.length > 0 &&
    Object.keys(answers).length === questions.length;

  const selectAnswer = (questionIndex, optionKey) => {
    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: optionKey,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!complete || submitting) return;

    try {
      setSubmitting(true);
      setError("");

      const orderedAnswers = questions.map(
        (_, index) => answers[index]
      );

      const data = await quizApi.submit(orderedAnswers);

      setResult(data.result);
      setSubmitted(true);
    } catch (e) {
      setError(e.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const tryAgain = () => {
    setAnswers({});
    setResult(null);
    setSubmitted(false);
    setError("");
  };

  if (loading) {
    return (
      <section className="section container narrow">
        <div className="page-heading">
          <span className="eyebrow">KNOWLEDGE CHECK</span>
          <h1>Loading quiz...</h1>
          <p>Please wait while we load the quiz from SkillTrack.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section container narrow">
      <div className="page-heading">
        <span className="eyebrow">KNOWLEDGE CHECK</span>

        <h1>{quiz?.title || "Full Stack Web Development Quiz"}</h1>

        <p>
          {quiz?.description ||
            "Test your understanding of full stack web development."}
        </p>

        {quiz?.passingScore !== undefined && (
          <p>
            Passing score: <strong>{quiz.passingScore}%</strong>
          </p>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      {questions.length === 0 ? (
        <div className="empty-state">
          <h2>No quiz is available.</h2>
          <p>Please try again later.</p>
        </div>
      ) : (
        <form className="quiz-form" onSubmit={submit}>
          {questions.map((q, index) => (
            <fieldset className="quiz-question" key={q.id}>
              <legend>
                {index + 1}. {q.question}
              </legend>

              <div className="quiz-options">
                {q.options.map((option) => (
                  <label
                    className={
                      answers[index] === option.key
                        ? "selected"
                        : ""
                    }
                    key={option.key}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option.key}
                      checked={answers[index] === option.key}
                      onChange={() =>
                        selectAnswer(index, option.key)
                      }
                    />

                    <span>
                      <strong>{option.key}.</strong>{" "}
                      {option.text}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <button
            className="button button-primary"
            type="submit"
            disabled={!complete || submitting}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>

          {!complete && (
            <p className="quiz-progress">
              Answer all {questions.length} questions before
              submitting.
            </p>
          )}
        </form>
      )}

      {submitted && result && (
        <Modal
          title={
            result.passed
              ? "Excellent work! 🎉"
              : "Good attempt!"
          }
          onClose={() => setSubmitted(false)}
        >
          <div className="quiz-result">
            <strong>
              {result.score}/{result.total}
            </strong>

            <span>
              {result.percentage}% —{" "}
              {result.passed
                ? "You passed the quiz."
                : "Review your lessons and try again."}
            </span>

            <span>
              Passing score: {result.passingScore}%
            </span>
          </div>

          <div className="modal-actions">
            <button
              className="button button-secondary"
              onClick={tryAgain}
              type="button"
            >
              Try Again
            </button>

            <Link
              className="button button-primary"
              to="/dashboard"
            >
              Dashboard
            </Link>
          </div>
        </Modal>
      )}
    </section>
  );
}