-- Database Migration Script for EclipseTemplate Support
-- Run this script on your production database to add new columns

-- 1. Add new text column for detailed about description
ALTER TABLE profiles ADD COLUMN about_description TEXT;

-- 2. Add JSON columns for additional profile data
ALTER TABLE profiles ADD COLUMN education JSONB;
ALTER TABLE profiles ADD COLUMN experience JSONB;
ALTER TABLE profiles ADD COLUMN skills_categories JSONB;
ALTER TABLE profiles ADD COLUMN about_stats JSONB;
ALTER TABLE profiles ADD COLUMN services JSONB;
ALTER TABLE profiles ADD COLUMN additional_info JSONB;

-- 3. Add role column to projects table (if you have a separate projects table)
-- If projects are stored as JSONB in profiles table, you don't need this
-- ALTER TABLE projects ADD COLUMN role VARCHAR(255);

-- 4. Update template enum to include 'eclipse' (if using enum type)
-- If you're using a text field for template, this is not needed
-- ALTER TYPE template_type ADD VALUE 'eclipse';

-- 5. Create indexes for better performance on JSONB columns (optional but recommended)
CREATE INDEX idx_profiles_education ON profiles USING GIN (education);
CREATE INDEX idx_profiles_experience ON profiles USING GIN (experience);
CREATE INDEX idx_profiles_skills_categories ON profiles USING GIN (skills_categories);
CREATE INDEX idx_profiles_about_stats ON profiles USING GIN (about_stats);
CREATE INDEX idx_profiles_services ON profiles USING GIN (services);
CREATE INDEX idx_profiles_additional_info ON profiles USING GIN (additional_info);

-- 6. Add comments to document the new columns
COMMENT ON COLUMN profiles.about_description IS 'Detailed about description for the about section (separate from bio)';
COMMENT ON COLUMN profiles.education IS 'JSON array of education items with institution, degree, period, location, gpa, achievements';
COMMENT ON COLUMN profiles.experience IS 'JSON array of experience items with company, position, period, location, description, achievements, technologies_used';
COMMENT ON COLUMN profiles.skills_categories IS 'JSON array of skill categories with category, icon, title, subtitle, and skills array with name and percentage';
COMMENT ON COLUMN profiles.about_stats IS 'JSON array of about statistics with icon, title, and subtitle';
COMMENT ON COLUMN profiles.services IS 'JSON array of services with icon, title, and description';
COMMENT ON COLUMN profiles.additional_info IS 'JSON object with location, availability, years_of_experience, languages, certifications';

-- 7. Example data structure for reference (you can insert this as sample data)
/*
Example JSON structure for education:
[
  {
    "institution": "XYZ University",
    "degree": "BFA in Graphic Design",
    "period": "2011 - 2013",
    "location": "Sometown, NJ",
    "gpa": 3.8,
    "achievements": ["Dean's List", "Best Design Award"]
  }
]

Example JSON structure for experience:
[
  {
    "company": "Copalopa Inc.",
    "position": "Lead UX Designer",
    "period": "2018 - Present",
    "location": "Sometown, NJ",
    "description": "Leading design team for web applications",
    "achievements": ["Improved user engagement by 40%", "Led 5 successful projects"],
    "technologies_used": ["Figma", "Sketch", "Adobe Creative Suite"]
  }
]

Example JSON structure for skills_categories:
[
  {
    "category": "Frontend",
    "icon": "uil-brackets-curly",
    "title": "Frontend Developer",
    "subtitle": "More than 4 years",
    "skills": [
      {"name": "HTML", "percentage": 90},
      {"name": "CSS", "percentage": 90},
      {"name": "JavaScript", "percentage": 80}
    ]
  }
]

Example JSON structure for about_stats:
[
  {
    "icon": "uil-graduation-cap",
    "title": "Education",
    "subtitle": "BTech Graduate"
  }
]

Example JSON structure for services:
[
  {
    "icon": "uil-web-grid",
    "title": "Web Designer",
    "description": "User Interface Development, Web Page Development, Responsive Design, Performance Optimization"
  }
]

Example JSON structure for additional_info:
{
  "location": "Sometown, NJ",
  "availability": "Available for hire",
  "years_of_experience": 5,
  "languages": ["English", "Spanish"],
  "certifications": ["AWS Certified", "Google Cloud Professional"]
}
*/

-- 8. Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('about_description', 'education', 'experience', 'skills_categories', 'about_stats', 'services', 'additional_info')
ORDER BY column_name;

-- Migration completed successfully!
-- You can now use the EclipseTemplate with the new fields
