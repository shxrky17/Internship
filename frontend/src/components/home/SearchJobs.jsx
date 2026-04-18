import React, { useState } from "react";
import { MapPin, Building2, Star, Upload } from "lucide-react";

function SearchJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSearchFromResume = async () => {
    if (!resumeFile) {
      setError("Please upload a resume PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    setJobs([]);
    setHasSearched(false);

    try {
      const formData = new FormData();
      formData.append("file", resumeFile);

      // Step 1: analyze resume
      const analyzeResponse = await fetch("http://127.0.0.1:8000/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      const analyzeData = await analyzeResponse.json();

      // Build query from backend response if backend returns resume_query
      let generatedQuery = analyzeData.resume_query;

      // Fallback: build query in frontend if resume_query is not returned
      if (!generatedQuery) {
        const summary = analyzeData.structured_json?.summary || "";
        const skills = analyzeData.all_extracted_skills || [];
        generatedQuery = `${summary} skills ${skills.slice(0, 15).join(" ")}`.trim();
      }

      setHasSearched(true);

      // Step 2: search jobs using generated resume query
      const searchResponse = await fetch(
        `http://127.0.0.1:8000/search?query=${encodeURIComponent(generatedQuery)}&top_k=5`,
        {
          method: "GET",
        }
      );

      if (!searchResponse.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const searchData = await searchResponse.json();

      // Filter jobs: only keep jobs with score > 2.5
      const filteredJobs = (searchData.matches || []).filter(
        (job) => Number(job.score) > 0.35
      );

      setJobs(filteredJobs);
    } catch (err) {
      console.error(err);
      setError("Unable to load jobs from resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Recommended Jobs</h1>

      <div className="bg-white shadow-md rounded-2xl p-6 border mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full md:w-auto"
          />

          <button
            onClick={handleSearchFromResume}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Processing..." : "Find Jobs from Resume"}
          </button>
        </div>

        {resumeFile && (
          <p className="mt-3 text-sm text-gray-600">
            Selected file: <span className="font-medium">{resumeFile.name}</span>
          </p>
        )}

      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading jobs...</p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && !error && jobs.length === 0 && hasSearched && (
        <p className="text-center text-gray-500">
          No jobs found with score greater than 2.5.
        </p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold capitalize">
                  {job.metadata?.title || "Untitled Job"}
                </h2>

                <span className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4" />
                  {job.score !== undefined ? job.score.toFixed(3) : "N/A"}
                </span>
              </div>

              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="capitalize font-medium">
                    {job.metadata?.company || "Unknown Company"}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="capitalize">
                    {job.metadata?.location || "Unknown Location"}
                  </span>
                </p>

                <div>
                  <p className="font-medium mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {(job.metadata?.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchJobs;
