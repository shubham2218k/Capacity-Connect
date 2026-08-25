const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Course = require('../models/Course');

// @desc    Create Assessment
// @route   POST /api/assessments
exports.createAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create({
      ...req.body,
      trainerId: req.user._id
    });
    res.status(201).json({ success: true, message: 'Assessment created', data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trainer assessments
// @route   GET /api/assessments/trainer
exports.getTrainerAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ trainerId: req.user._id }).populate('courseId', 'title');
    res.status(200).json({ success: true, count: assessments.length, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assessment by ID
// @route   GET /api/assessments/:id
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).lean();
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    // Hide answers if user is trainee
    if (req.user.role === 'Trainee') {
      if (assessment.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Assessment not available' });
      }
      assessment.questions = assessment.questions.map(q => {
        const safeQ = { ...q };
        delete safeQ.correctAnswer;
        delete safeQ.explanation;
        return safeQ;
      });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update assessment
// @route   PATCH /api/assessments/:id
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    if (assessment.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    Object.assign(assessment, req.body);
    await assessment.save();

    res.status(200).json({ success: true, message: 'Assessment updated', data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit assessment
// @route   POST /api/assessments/:id/submit
exports.submitAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    const { answers } = req.body; // Array of { questionId, selectedAnswer }
    let score = 0;
    const processedAnswers = [];

    assessment.questions.forEach(q => {
      const submittedAnswer = answers.find(a => a.questionId === q._id.toString());
      const isCorrect = submittedAnswer && submittedAnswer.selectedAnswer === q.correctAnswer;
      
      if (isCorrect) score++;

      processedAnswers.push({
        questionId: q._id,
        selectedAnswer: submittedAnswer ? submittedAnswer.selectedAnswer : null,
        isCorrect
      });
    });

    const percentage = Math.round((score / assessment.questions.length) * 100);
    const passed = percentage >= assessment.passingScore;

    const attempt = await AssessmentAttempt.create({
      assessmentId: assessment._id,
      traineeId: req.user._id,
      answers: processedAnswers,
      score,
      percentage,
      passed
    });

    res.status(201).json({ 
      success: true, 
      message: 'Assessment submitted successfully', 
      data: { score, percentage, passed, attemptId: attempt._id } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assessment results for a specific assessment (Trainer view)
// @route   GET /api/assessments/:id/results
exports.getAssessmentResults = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    if (assessment.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const results = await AssessmentAttempt.find({ assessmentId: req.params.id })
      .populate('traineeId', 'name email department');
    
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
