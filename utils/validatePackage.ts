interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePackageJson(json: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!json || typeof json !== "object") {
    errors.push("Invalid JSON: File must contain a valid JSON object.");
    return { isValid: false, errors, warnings };
  }

  if (Array.isArray(json)) {
    errors.push("Invalid format: Expected a JSON object, not an array.");
    return { isValid: false, errors, warnings };
  }

  const pkg = json as Record<string, unknown>;

  // Check for required fields
  const name = pkg.name;
  const version = pkg.version;
  const description = pkg.description;
  const license = pkg.license;
  const dependencies = pkg.dependencies;
  const devDependencies = pkg.devDependencies;
  const scripts = pkg.scripts;

  if (!name || typeof name !== "string") {
    errors.push(
      'Missing or invalid "name" field. Every package.json must have a name.',
    );
  } else if (name.length > 214) {
    errors.push("Package name exceeds the maximum length of 214 characters.");
  }

  if (!version || typeof version !== "string") {
    errors.push(
      'Missing or invalid "version" field. Package version is required.',
    );
  } else if (!/^\d+\.\d+\.\d+/.test(version)) {
    warnings.push("Version format may not follow semver (e.g., 1.0.0).");
  }

  // Warnings (non-blocking)
  if (!description) {
    warnings.push(
      "No description provided. Consider adding one for better documentation.",
    );
  }

  if (!license) {
    warnings.push("No license specified. Consider adding a license field.");
  }

  if (dependencies && typeof dependencies !== "object") {
    errors.push('"dependencies" field must be an object.');
  }

  if (devDependencies && typeof devDependencies !== "object") {
    errors.push('"devDependencies" field must be an object.');
  }

  if (scripts && typeof scripts !== "object") {
    errors.push('"scripts" field must be an object.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateFile(file: File): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!file) {
    errors.push("No file provided.");
    return { isValid: false, errors, warnings };
  }

  if (!file.name.endsWith(".json")) {
    errors.push(
      `Invalid file type: "${file.name}". Only .json files are accepted.`,
    );
  }

  if (file.size === 0) {
    errors.push("File is empty. Please select a valid package.json file.");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push(
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 5MB limit.`,
    );
  }

  if (file.name !== "package.json" && file.name.endsWith(".json")) {
    warnings.push(
      `File is named "${file.name}" instead of "package.json". We'll try to analyze it anyway.`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}