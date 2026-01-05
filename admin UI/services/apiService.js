// src/services/apiService.js

// Base URL of Spring Boot backend
const API_BASE_URL = "http://localhost:8080/api/admin/issues";

/**
 * GET /api/admin/issues
 * Fetches all issues for the admin dashboard.
 */
export const fetchIssues = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch issues');
    }

    // Backend returns List<Issues> (array)
    return await response.json();
  } catch (error) {
    console.error("Backend Fetch Error:", error);
    throw error;
  }
};

/**
 * PATCH /api/admin/issues/{id}
 * Updates issue status and optional rejectionReason.
 * `issue` must contain: { id, status, rejectionReason? }.
 */
export const updateIssue = async (issue) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${issue.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: issue.status,
        rejectionReason: issue.rejectionReason ?? null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend Update Error:", errorData);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Network/Server Error during sync:", error);
    return false;
  }
};
