export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://student-ai-project.onrender.com/api' : 'http://localhost:8000/api');

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// Silently refresh the JWT token using the stored refresh token.
// Returns true if successful, false otherwise.
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Wrapper around fetch that auto-retries once on 401 after refreshing token.
async function fetchWithAuth(
  url: string,
  options: RequestInit,
  isStream = false
): Promise<Response> {
  console.log(`[API] fetchWithAuth starting for URL: ${url}`);
  let res = await fetch(url, { ...options, headers: getAuthHeaders() }).catch(err => {
    console.error(`[API] fetch error for ${url}:`, err);
    throw new Error(`Network error: Could not reach the server. Is the backend running on port 8000?`);
  });
  console.log(`[API] fetchWithAuth response for URL: ${url} - Status: ${res.status}`);

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      // Force redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Dispatch event so UI components can react before redirect
      window.dispatchEvent(new CustomEvent('session-expired'));
      throw new Error('Session expired. Please log in again.');
    }
    // Retry with fresh token
    res = await fetch(url, { ...options, headers: getAuthHeaders() });
  }
  return res;
}

export async function login(credentials: any) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(data: any) {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function googleLogin(accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken }),
  });
  if (!res.ok) throw new Error('Google login failed');
  return res.json();
}

export async function resetPassword(data: any) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Password reset failed');
  return json;
}

export async function getDocuments() {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/`, {});
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function getUserProfile() {
  const res = await fetchWithAuth(`${API_BASE_URL}/auth/me/`, {});
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', file.name);

  const token = localStorage.getItem('access_token');
  let res = await fetch(`${API_BASE_URL}/documents/`, {
    method: 'POST',
    headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: formData,
  });
  // Handle 401 for file upload separately (no Content-Type header)
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = localStorage.getItem('access_token');
      res = await fetch(`${API_BASE_URL}/documents/`, {
        method: 'POST',
        headers: { ...(newToken ? { 'Authorization': `Bearer ${newToken}` } : {}) },
        body: formData,
      });
    }
  }
  if (!res.ok) throw new Error('Failed to upload document');
  return res.json();
}

export async function deleteDocument(docId: number) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete document');
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

export async function summarizeDocument(docId: number) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/summarize/`, { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to summarize document');
  }
  return res.json();
}

export async function askQuestion(docId: number, question: string) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/ask/`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to ask question');
  }
  return res.json();
}

export async function getSmartReadHighlights(docId: number) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/smart-read/`, {});
  if (!res.ok) throw new Error('Failed to fetch highlights');
  return res.json();
}

export async function generateStudyGuide(docId: number) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/study-guide/`, { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate study guide');
  }
  return res.json();
}

export async function generateQuiz(docId: number, quizType: string = 'objective', numQuestions: number = 5) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/quiz/`, {
    method: 'POST',
    body: JSON.stringify({ quiz_type: quizType, num_questions: numQuestions }),
  });
  if (!res.ok) throw new Error('Failed to generate quiz');
  return res.json();
}

export async function generateFlashcards(docId: number, numFlashcards: number = 10) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/flashcards/`, {
    method: 'POST',
    body: JSON.stringify({ num_flashcards: numFlashcards }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate flashcards');
  }
  return res.json();
}

export async function saveQuizResult(data: any) {
  const res = await fetchWithAuth(`${API_BASE_URL}/save-quiz-result/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save quiz result');
  return res.json();
}

export async function getQuizHistory() {
  const res = await fetchWithAuth(`${API_BASE_URL}/quiz-history/`, {});
  if (!res.ok) throw new Error('Failed to fetch quiz history');
  return res.json();
}

export async function gradeTheoryQuiz(docId: number, answers: any[]) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/grade-theory/`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error('Failed to grade theory quiz');
  return res.json();
}

export async function getInteractionHistory(docId?: number, type?: string) {
  let url = `${API_BASE_URL}/interaction-history/?`;
  if (docId) url += `doc_id=${docId}&`;
  if (type) url += `type=${type}&`;
  const res = await fetchWithAuth(url, {});
  if (!res.ok) throw new Error('Failed to fetch interaction history');
  return res.json();
}

export async function deleteInteraction(id: number) {
  const res = await fetchWithAuth(`${API_BASE_URL}/interaction-history/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete interaction');
  return res.status === 204 ? null : res.json().catch(() => null);
}

// --- Streaming API Functions ---

async function readStream(res: Response, onChunk: (text: string) => void): Promise<void> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

export async function streamSummarize(
  docId: number,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/summarize/?stream=true`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to summarize document');
  }
  await readStream(res, onChunk);
}

export async function streamStudyGuide(
  docId: number,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/study-guide/?stream=true`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate study guide');
  }
  await readStream(res, onChunk);
}

export async function streamAskQuestion(
  docId: number,
  question: string,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/ask/?stream=true`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to ask question');
  }
  await readStream(res, onChunk);
}

export async function explainSimpler(
  text: string,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/explain-simpler/?stream=true`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to simplify');
  }
  await readStream(res, onChunk);
}

export async function getSchedules() {
  const res = await fetchWithAuth(`${API_BASE_URL}/schedules/`, {});
  if (!res.ok) throw new Error('Failed to fetch schedules');
  return res.json();
}

export async function createSchedule(exam_name: string, exam_date: string, document_ids: number[]) {
  const res = await fetchWithAuth(`${API_BASE_URL}/schedules/`, {
    method: 'POST',
    body: JSON.stringify({ exam_name, exam_date, document_ids }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create schedule');
  }
  return res.json();
}

export async function deleteSchedule(scheduleId: number) {
  const res = await fetchWithAuth(`${API_BASE_URL}/schedules/${scheduleId}/`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete schedule');
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

export async function downloadPdf(title: string, content: string) {
  const res = await fetchWithAuth(`${API_BASE_URL}/generate-pdf/`, {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate PDF');
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/ /g, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function generateMindMap(docId: number) {
  const res = await fetchWithAuth(`${API_BASE_URL}/documents/${docId}/mindmap/`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate mind map');
  }
  return res.json();
}

export async function generateMultiQuiz(
  docIds: number[],
  quizType: string = 'objective',
  numQuestions: number = 10
) {
  console.log(`[API] generateMultiQuiz called with docIds:`, docIds);
  const res = await fetchWithAuth(`${API_BASE_URL}/quiz/multi/`, {
    method: 'POST',
    body: JSON.stringify({ doc_ids: docIds, quiz_type: quizType, num_questions: numQuestions }),
  });
  console.log(`[API] generateMultiQuiz response status: ${res.status}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate multi-document quiz');
  }
  return res.json();
}

export async function analyzeQuizPerformance(quizData: any[], userAnswers: Record<number, number | string>, score: number, total: number) {
  const res = await fetchWithAuth(`${API_BASE_URL}/quiz/analyze-performance/`, {
    method: 'POST',
    body: JSON.stringify({ quiz_data: quizData, user_answers: userAnswers, score, total }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze performance');
  }
  return res.json();
}

export async function getAnalytics() {
  const res = await fetchWithAuth(`${API_BASE_URL}/analytics/`, { method: 'GET' });
  if (!res.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return res.json();
}
