/**
 * Survey Kost (Wishlist) Service
 * Simulates backend using https://jsonplaceholder.typicode.com
 * 
 * Endpoints:
 * - GET /todos?_limit=10 (Fetch initial survey list)
 * - POST /todos (Add new survey item with body: { task })
 * - PATCH /todos/:id (Toggle survey status: Belum Disurvey <-> Sudah Disurvey)
 */

export const SURVEY_API_BASE = 'https://jsonplaceholder.typicode.com';

// Realistic Indonesian Kost names to map initial todos into student-friendly kost survey targets
const SAMPLE_KOST_NAMES = [
  'Kost Griya Mahasiswa UI Melati (Kutek)',
  'Kost Putra Graha Pogung UGM (Fasilitas AC)',
  'Kost Putri Dwi Sartika Dago ITB',
  'Kost Campur Kartika Margonda Depok',
  'Kost Mahasiswi Asri Kaliurang KM 5',
  'Kost Wisma Kirana Grogol Trisakti',
  'Kost Paviliun Dharmawangsa UNAIR',
  'Kost Eksklusif Residence Dipatiukur',
  'Kost Cendrawasih Pogung Kidul',
  'Kost Pondok Syariah Beji Depok',
];

/**
 * Fetch survey list on initial load or refresh
 * @param {number} limit 
 * @param {object} options 
 * @returns {Promise<Array>}
 */
export const fetchSurveyList = async (limit = 10, options = {}) => {
  const { timeoutMs = 8000, signal = null } = options;
  const controller = signal ? null : new AbortController();
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const url = `${SURVEY_API_BASE}/todos?_limit=${limit}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: signal || (controller ? controller.signal : undefined),
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      const error = new Error(`Server merespons dengan status HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const rawData = await response.json();

    // Map todos to rich survey items
    return rawData.map((item, index) => {
      const defaultName = SAMPLE_KOST_NAMES[index % SAMPLE_KOST_NAMES.length];
      return {
        id: item.id,
        // Preserve both task and title
        task: item.task || defaultName,
        title: item.title || defaultName,
        completed: Boolean(item.completed),
        createdAt: new Date(Date.now() - (index * 86400000)).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
        }),
      };
    });
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Waktu permintaan habis saat mengambil daftar survey.');
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }
    throw err;
  }
};

/**
 * Add a new kost to the survey list via POST /todos
 * Request Body: JSON.stringify({ task })
 * @param {string} taskText 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export const addSurveyItem = async (taskText, options = {}) => {
  const { timeoutMs = 8000 } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${SURVEY_API_BASE}/todos`;
    const bodyPayload = {
      task: taskText.trim(),
      title: taskText.trim(),
      completed: false,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(bodyPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = new Error(`Gagal menambah kost survey (HTTP ${response.status})`);
      error.status = response.status;
      throw error;
    }

    const result = await response.json();
    return {
      id: result.id || Date.now(),
      task: result.task || taskText.trim(),
      title: result.title || taskText.trim(),
      completed: false,
      createdAt: 'Baru saja',
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Permintaan menambah survey gagal karena waktu habis (timeout).');
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }
    throw err;
  }
};

/**
 * Toggle survey item status via PATCH /todos/:id
 * Changes status between "Belum Disurvey" and "Sudah Disurvey"
 * @param {number|string} id 
 * @param {boolean} nextCompleted 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export const toggleSurveyItem = async (id, nextCompleted, options = {}) => {
  const { timeoutMs = 8000 } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${SURVEY_API_BASE}/todos/${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        completed: nextCompleted,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = new Error(`Gagal mengubah status survey (HTTP ${response.status})`);
      error.status = response.status;
      throw error;
    }

    const result = await response.json();
    return {
      id,
      completed: result.completed !== undefined ? Boolean(result.completed) : nextCompleted,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Permintaan update status gagal karena waktu habis (timeout).');
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }
    throw err;
  }
};
