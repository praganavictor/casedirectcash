const API_BASE_URL = 'http://localhost:3000';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateDefaultDateRange = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return {
    from: formatDateToYYYYMMDD(sevenDaysAgo),
    to: formatDateToYYYYMMDD(today),
  };
};

const showLoading = () => {
  const loadingContainer = document.getElementById('loading-container');
  loadingContainer.innerHTML = '<div class="loading">Carregando eventos...</div>';
};

const hideLoading = () => {
  const loadingContainer = document.getElementById('loading-container');
  loadingContainer.innerHTML = '';
};

const showError = (message) => {
  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = `<div class="error">${message}</div>`;

  setTimeout(() => {
    errorContainer.innerHTML = '';
  }, 5000);
};

const renderEmptyState = () => {
  const tbody = document.getElementById('events-tbody');
  tbody.innerHTML = `
    <tr>
      <td colspan="5">
        <div class="empty-state">
          <h3>Nenhum evento encontrado</h3>
          <p>Não há eventos registrados no período selecionado.</p>
        </div>
      </td>
    </tr>
  `;
};

const renderEvents = (events) => {
  const tbody = document.getElementById('events-tbody');

  if (!events || events.length === 0) {
    renderEmptyState();
    return;
  }

  const rows = events.map((event) => {
    const badgeClass = event.type === 'payment' ? 'badge-payment' : 'badge-upsell';
    const typeLabel = event.type === 'payment' ? 'Venda' : 'Upsell';

    return `
      <tr>
        <td><span class="badge ${badgeClass}">${typeLabel}</span></td>
        <td>${event.name}</td>
        <td>${event.email}</td>
        <td class="value">${formatCurrency(event.value)}</td>
        <td>${formatDateTime(event.timestamp)}</td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
};

const fetchEvents = async (dateFrom, dateTo) => {
  const params = new URLSearchParams();

  if (dateFrom) {
    params.append('date_from', dateFrom);
  }

  if (dateTo) {
    params.append('date_to', dateTo);
  }

  const url = `${API_BASE_URL}/api/events?${params.toString()}`;

  try {
    showLoading();

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao carregar eventos');
    }

    const events = await response.json();
    renderEvents(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    showError(error.message || 'Erro ao carregar eventos. Tente novamente.');
    renderEmptyState();
  } finally {
    hideLoading();
  }
};

const initializeDateInputs = () => {
  const defaultDates = calculateDefaultDateRange();
  const dateFromInput = document.getElementById('date-from');
  const dateToInput = document.getElementById('date-to');

  dateFromInput.value = defaultDates.from;
  dateToInput.value = defaultDates.to;
};

const setupEventListeners = () => {
  const refreshBtn = document.getElementById('refresh-btn');
  const dateFromInput = document.getElementById('date-from');
  const dateToInput = document.getElementById('date-to');

  refreshBtn.addEventListener('click', () => {
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;
    fetchEvents(dateFrom, dateTo);
  });

  dateFromInput.addEventListener('change', () => {
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;
    fetchEvents(dateFrom, dateTo);
  });

  dateToInput.addEventListener('change', () => {
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;
    fetchEvents(dateFrom, dateTo);
  });
};

const initialize = () => {
  initializeDateInputs();
  setupEventListeners();

  const dateFromInput = document.getElementById('date-from');
  const dateToInput = document.getElementById('date-to');
  fetchEvents(dateFromInput.value, dateToInput.value);
};

document.addEventListener('DOMContentLoaded', initialize);
