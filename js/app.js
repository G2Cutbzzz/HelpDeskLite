const STORAGE_KEY = 'HELPDESK_TICKETS_V1';

const ALLOWED_TRANSITIONS = {
  'Nuevo': ['En proceso', 'Cancelado'],
  'En proceso': ['Resuelto', 'Cancelado'],
  'Resuelto': ['Cerrado'],
  'Cerrado': [],
  'Cancelado': []
};

let tickets = [];
let currentFilterStatus = 'Todos';
let currentFilterPriority = 'Todas';
let currentSearchTerm = '';

// DOM
const ticketsContainer = document.querySelector('#tickets-container');
const emptyState = document.querySelector('#empty-state');
const ticketForm = document.querySelector('#ticket-form');
const searchInput = document.querySelector('#search-input');
const priorityFilter = document.querySelector('#priority-filter');
const statusFilterButtons = document.querySelectorAll('#status-filter-container .filter-btn');

const modal = document.querySelector('#modal-form');
const btnOpenModal = document.querySelector('#btn-toggle-modal');
const btnCloseModal = document.querySelector('#btn-close-modal');

const kpiTotal = document.querySelector('#kpi-total');
const kpiNew = document.querySelector('#kpi-new');
const kpiInProgress = document.querySelector('#kpi-in-progress');
const kpiResolved = document.querySelector('#kpi-resolved');

document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  setupEventListeners();
  render();
});

function setupEventListeners() {
  btnOpenModal.addEventListener('click', () => modal.classList.remove('hidden'));
  btnCloseModal.addEventListener('click', () => modal.classList.add('hidden'));

  ticketForm.addEventListener('submit', handleFormSubmit);

  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.trim().toLowerCase();
    render();
  });

  priorityFilter.addEventListener('change', (e) => {
    currentFilterPriority = e.target.value;
    render();
  });

  statusFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      statusFilterButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      currentFilterStatus = button.dataset.status;
      render();
    });
  });

  ticketsContainer.addEventListener('click', handleTicketActions);
}

function generateFolio(nextId) {
  return `HD-${String(nextId).padStart(4, '0')}`;
}

function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  const category = document.querySelector('#category').value;
  const priority = document.querySelector('#priority').value;

  if (!title || !description || !category || !priority) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  const nextId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;

  const newTicket = {
    id: nextId,
    folio: generateFolio(nextId),
    title,
    description,
    category,
    priority,
    status: 'Nuevo',
    createdAt: new Date().toISOString()
  };

  tickets.unshift(newTicket);
  saveToLocalStorage();
  render();

  ticketForm.reset();
  modal.classList.add('hidden');
}

function changeTicketStatus(ticketId, newStatus) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const validNextStates = ALLOWED_TRANSITIONS[ticket.status] || [];

  if (!validNextStates.includes(newStatus)) {
    alert(`Transición inválida: No se puede cambiar de "${ticket.status}" a "${newStatus}".`);
    return;
  }

  ticket.status = newStatus;
  saveToLocalStorage();
  render();
}

function handleTicketActions(e) {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const ticketId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'start') changeTicketStatus(ticketId, 'En proceso');
  if (action === 'resolve') changeTicketStatus(ticketId, 'Resuelto');
  if (action === 'close') changeTicketStatus(ticketId, 'Cerrado');
  if (action === 'cancel') changeTicketStatus(ticketId, 'Cancelado');
}

function getFilteredTickets() {
  return tickets.filter(ticket => {
    const matchesStatus = (currentFilterStatus === 'Todos') || (ticket.status === currentFilterStatus);
    const matchesPriority = (currentFilterPriority === 'Todas') || (ticket.priority === currentFilterPriority);

    const matchesSearch = currentSearchTerm === '' ||
      ticket.folio.toLowerCase().includes(currentSearchTerm) ||
      ticket.title.toLowerCase().includes(currentSearchTerm) ||
      ticket.description.toLowerCase().includes(currentSearchTerm);

    return matchesStatus && matchesPriority && matchesSearch;
  });
}

function updateDashboard() {
  kpiTotal.textContent = tickets.length;
  kpiNew.textContent = tickets.filter(t => t.status === 'Nuevo').length;
  kpiInProgress.textContent = tickets.filter(t => t.status === 'En proceso').length;
  kpiResolved.textContent = tickets.filter(t => t.status === 'Resuelto').length;
}

function render() {
  updateDashboard();
  const visibleTickets = getFilteredTickets();

  ticketsContainer.innerHTML = '';

  if (visibleTickets.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  visibleTickets.forEach(ticket => {
    const card = document.createElement('article');
    card.classList.add('ticket-card');

    const formattedDate = new Date(ticket.createdAt).toLocaleString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const badgeClass = `badge-${ticket.priority.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;

    let actionButtons = '';
    if (ticket.status === 'Nuevo') {
      actionButtons = `
        <button class="btn btn-primary" data-id="${ticket.id}" data-action="start">Iniciar atención</button>
        <button class="btn btn-danger" data-id="${ticket.id}" data-action="cancel">Cancelar</button>
      `;
    } else if (ticket.status === 'En proceso') {
      actionButtons = `
        <button class="btn btn-success" data-id="${ticket.id}" data-action="resolve">Resolver</button>
        <button class="btn btn-danger" data-id="${ticket.id}" data-action="cancel">Cancelar</button>
      `;
    } else if (ticket.status === 'Resuelto') {
      actionButtons = `
        <button class="btn btn-secondary" data-id="${ticket.id}" data-action="close">Cerrar</button>
      `;
    }

    card.innerHTML = `
      <div class="ticket-header">
        <span class="ticket-folio">${ticket.folio}</span>
        <span class="ticket-badge ${badgeClass}">${ticket.priority}</span>
      </div>
      <h3>${ticket.title}</h3>
      <p>${ticket.description}</p>
      <div class="ticket-meta">
        <span><strong>Cat:</strong> ${ticket.category}</span>
        <span><strong>Estado:</strong> ${ticket.status}</span>
        <span><strong>Creado:</strong> ${formattedDate}</span>
      </div>
      ${actionButtons ? `<div class="ticket-actions">${actionButtons}</div>` : ''}
    `;

    ticketsContainer.appendChild(card);
  });
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tickets = saved ? JSON.parse(saved) : [];
}




