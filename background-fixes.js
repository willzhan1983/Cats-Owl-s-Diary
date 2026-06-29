/* Background hotfixes for missing image files.
 * The original PNG school background path may be absent on static deploys, so
 * this script points the first-school background keys to a committed SVG file.
 */
(function applyBackgroundFixes() {
  const schoolBackground = "./assets/generated/forest-school-background.svg?v=20260629";

  if (typeof backgroundSources !== "undefined") {
    backgroundSources.schoolyard = schoolBackground;
    backgroundSources.forestSchool = schoolBackground;
  }

  if (typeof backgroundSourceCandidates !== "undefined") {
    backgroundSourceCandidates.schoolyard = [schoolBackground];
    backgroundSourceCandidates.forestSchool = [schoolBackground];
  }

  if (typeof backgrounds !== "undefined") {
    delete backgrounds.schoolyard;
    delete backgrounds.forestSchool;
  }

  if (typeof ensureBackground === "function") {
    ensureBackground("schoolyard");
    ensureBackground("forestSchool");
  }
})();
