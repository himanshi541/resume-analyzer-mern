import Analysis from "../models/Analysis.js";

export const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("jobTitle matchScore atsScore keywordStrength createdAt");
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete." });
  }
};
