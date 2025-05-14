document.addEventListener('DOMContentLoaded', function() {
    const monthYearElement = document.getElementById('monthYear');
    const calendarDaysElement = document.getElementById('calendarDays');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const eventListElement = document.getElementById('eventList');
    const selectedDateDisplayElement = document.getElementById('selectedDateDisplay');

    const eventDateInput = document.getElementById('eventDate');
    const eventDescriptionInput = document.getElementById('eventDescription');
    const eventTypeInput = document.getElementById('eventType');
    const addEventButton = document.getElementById('addEventButton');

    let currentDate = new Date(2025, 0, 1);
    let selectedDayCell = null;
    let editingEventId = null; // NOVO: Para rastrear o ID do evento que está sendo editado

    // --- Initial Events Data (com IDs) ---
    let nextPredefinedId = 1; // Para gerar IDs para eventos predefinidos
    let events = [
        // Janeiro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-01', description: 'Confraternização Universal', type: 'holiday' },
        ...Array.from({length: 16}, (_, i) => ({ id: `predefined_${nextPredefinedId++}`, date: `2025-01-${(i+2).toString().padStart(2,'0')}`, description: 'Férias (Alunos e Professores)', type: 'vacation'})),
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-20', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-21', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-22', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-23', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-24', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-27', description: 'Abertura do Ano Letivo / Início 1º Trim.', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-29', description: 'Início p/ Berçário', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-01-31', description: 'Missa de Dom Bosco', type: 'special' },

        // Fevereiro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-02-28', description: 'Baile de Carnaval', type: 'special' },

        // Março 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-03-03', description: 'Recesso de Carnaval', type: 'recess' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-03-04', description: 'Carnaval', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-03-05', description: 'Quarta de Cinzas (Recesso)', type: 'recess' },
        // { id: `predefined_${nextPredefinedId++}`, date: '2025-03-10', description: 'Conselho/Reunião de Pais (C.)', type: 'special' },

        // Abril 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-04-17', description: 'Quinta Santa (Recesso)', type: 'recess' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-04-18', description: 'Paixão de Cristo', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-04-20', description: 'Páscoa', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-04-21', description: 'Tiradentes/Brasília', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-04-30', description: 'Término 1º Trimestre', type: 'special' },

        // Maio 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-05-01', description: 'Dia do Trabalho', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-05-02', description: 'Recesso Escolar', type: 'recess' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-05-05', description: 'Início 2º Trimestre', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-05-10', description: 'Dia das Mães (Sábado Letivo)', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-05-13', description: 'Madre Mazzarello', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-05-17', description: 'Reunião de Pais (Sábado Letivo)', type: 'special' },
        ...Array.from({length: 12}, (_, i) => {
            const day = i + 19;
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-05-${day.toString().padStart(2,'0')}`, description: 'Recuperação Paralela', type: 'special' };
        }),
        { id: `predefined_${nextPredefinedId++}`, date: '2025-05-24', description: 'Festa de Maria (Sábado Letivo)', type: 'special' },
        // { id: `predefined_${nextPredefinedId++}`, date: '2025-05-24', description: 'Recuperação Paralela', type: 'special' }, // Já coberto pelo Array.from acima

        // Junho 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-16', description: 'Avaliação Parcial', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-17', description: 'Avaliação Parcial', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-18', description: 'Avaliação Parcial', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-19', description: 'Corpus Christi', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-20', description: 'Recesso Escolar', type: 'recess' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-23', description: 'Avaliação Parcial', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-24', description: 'Avaliação Parcial', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-25', description: 'Avaliação Parcial', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-26', description: 'Avaliação Parcial', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-06-27', description: 'Avaliação Parcial', type: 'special' },

        // Julho 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-05', description: 'Festa Junina (Sábado Letivo)', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-07', description: 'JIESB', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-08', description: 'JIESB', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-09', description: 'JIESB', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-10', description: 'JIESB', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-11', description: 'JIESB / Término 1º semestre', type: 'special' },
        ...Array.from({length: 16}, (_, i) => {
            const day = i + 14;
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-07-${day.toString().padStart(2,'0')}`, description: 'Recesso Escolar para Professores', type: 'recess' };
        }),
        ...Array.from({length: 19}, (_, i) => {
            const day = i + 14;
            if (day <= 31) {
                return { id: `predefined_${nextPredefinedId++}`, date: `2025-07-${day.toString().padStart(2,'0')}`, description: 'Recesso Escolar Para Alunos', type: 'recess' };
            }
            return null;
        }).filter(e => e !== null),
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-30', description: 'Encontro Pedagógico', type: 'pedagogical' },
        // { id: `predefined_${nextPredefinedId++}`, date: '2025-07-30', description: 'Recesso Escolar Para Alunos', type: 'recess' }, // Coberto pelo Array.from
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-31', description: 'Encontro Pedagógico', type: 'pedagogical' },
        // { id: `predefined_${nextPredefinedId++}`, date: '2025-07-31', description: 'Recesso Escolar Para Alunos', type: 'recess' }, // Coberto pelo Array.from

        // Agosto 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-01', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-01', description: 'Recesso Escolar Para Alunos', type: 'recess' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-04', description: 'Início 2º semestre', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-09', description: 'Dia dos Pais (Evento - Sáb. Letivo)', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-16', description: 'Dom Bosco (Evento - Sáb. Letivo)', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-18', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-19', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-20', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-21', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-22', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-25', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-26', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-27', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-28', description: 'Avaliação Trimestral', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-29', description: 'Avaliação Trimestral / Término 2º Trim.', type: 'special' },

        // Setembro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-09-01', description: 'Início 3º Trimestre', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-09-07', description: 'Independência do Brasil', type: 'holiday' },
        ...Array.from({length: 10}, (_, i) => { // 15-19 e 22-26
            let day;
            if (i < 5) day = i + 15; // 15, 16, 17, 18, 19
            else day = (i - 5) + 22; // 22, 23, 24, 25, 26
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-09-${day.toString().padStart(2,'0')}`, description: 'Recuperação Paralela', type: 'special' };
        }),

        // Outubro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-10-04', description: 'Mostra Cultural - FECITESB (Sáb. Letivo)', type: 'special' },
        ...Array.from({length: 9}, (_, i) => { // 6-10 e 14-17
            let day;
            if (i < 5) day = i + 6; // 6, 7, 8, 9, 10
            else day = (i - 5) + 14; // 14, 15, 16, 17
             return { id: `predefined_${nextPredefinedId++}`, date: `2025-10-${day.toString().padStart(2,'0')}`, description: 'Avaliação Parcial', type: 'special' };
        }),
        { id: `predefined_${nextPredefinedId++}`, date: '2025-10-12', description: 'N. S. Aparecida', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-10-13', description: 'Dia do Professor (Recesso/Comemoração)', type: 'recess' },
        
        // Novembro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-11-02', description: 'Finados', type: 'holiday' },
        ...Array.from({length: 8}, (_, i) => { // 10-14 e 17-19
            let day;
            if (i < 5) day = i + 10; // 10,11,12,13,14
            else day = (i - 5) + 17; // 17,18,19
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-11-${day.toString().padStart(2,'0')}`, description: 'Avaliação Trimestral', type: 'special' };
        }),
        ...Array.from({length: 8}, (_, i) => { // Mesmas datas para Matrículas
            let day;
            if (i < 5) day = i + 10;
            else day = (i - 5) + 17;
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-11-${day.toString().padStart(2,'0')}`, description: 'Matrículas p/2026', type: 'special' };
        }),
        { id: `predefined_${nextPredefinedId++}`, date: '2025-11-15', description: 'Proclamação da República', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-11-20', description: 'Consciência Negra', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-11-21', description: 'Recesso Escolar', type: 'recess' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-11-30', description: 'Dia do Evangélico', type: 'holiday' },

        // Dezembro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-08', description: 'Recuperação Final - EF e EM', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-09', description: 'Recuperação Final - EF e EM', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-10', description: 'Recuperação Final - EF e EM', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-12', description: 'Término 3º Trimestre / Término Ano Letivo', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-15', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-16', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-17', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-18', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-19', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-12-25', description: 'Natal', type: 'holiday' },
    ];

    // Load events from localStorage
    const storedEvents = localStorage.getItem('calendarEvents2025');
    if (storedEvents) {
        const userAddedEvents = JSON.parse(storedEvents).filter(se => {
            // Garante que eventos do usuário tenham ID e não sejam duplicatas exatas dos predefinidos
            if (!se.id) se.id = `user_${Date.now()}_${Math.random()}`; // Garante ID se faltar no storage antigo
            return !events.some(ie => ie.id === se.id || (ie.date === se.date && ie.description === se.description && ie.type === se.type));
        });
        events = events.concat(userAddedEvents);
    }


    function saveEvents() {
        localStorage.setItem('calendarEvents2025', JSON.stringify(events));
    }
    // ... (todo o código JavaScript anterior até a função renderCalendar) ...

    const upcomingEventListElement = document.getElementById('upcomingEventList'); // NOVO: Referência à lista de próximos eventos

    // NOVO: Função para exibir os próximos eventos
    function displayUpcomingEvents() {
        upcomingEventListElement.innerHTML = ''; // Limpa a lista anterior
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normaliza para o início do dia

        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7); // Define a data limite (7 dias à frente)

        const upcoming = events.filter(event => {
            const eventDate = new Date(event.date + "T00:00:00"); // Adiciona T00:00:00 para evitar problemas de fuso horário na conversão
            return eventDate >= today && eventDate < sevenDaysLater;
        }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordena por data

        if (upcoming.length > 0) {
            upcoming.forEach(event => {
                const listItem = document.createElement('li');
                const eventDateObj = new Date(event.date + "T00:00:00");
                const formattedDate = eventDateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
                
                listItem.innerHTML = `<span class="event-date-reminder">${formattedDate}:</span> ${event.description}`;
                listItem.classList.add(event.type || 'special'); // Adiciona a classe do tipo de evento para possível estilização
                upcomingEventListElement.appendChild(listItem);
            });
        } else {
            upcomingEventListElement.innerHTML = '<li>Nenhum evento programado para os próximos 7 dias.</li>';
        }
    }

    // Modifique as chamadas existentes para também atualizar os próximos eventos
    
    function saveEvents() {
        localStorage.setItem('calendarEvents2025', JSON.stringify(events));
        displayUpcomingEvents(); // NOVO: Atualiza os próximos eventos ao salvar
    }
    
    function renderCalendar() {
        // ... (código existente da renderCalendar) ...
        // Ao final da renderCalendar, antes de fechar a função:
        displayUpcomingEvents(); // NOVO: Atualiza os próximos eventos ao renderizar o calendário
    }

    // Na função deleteEventItem, após saveEvents():
    function deleteEventItem(eventId) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            events = events.filter(event => event.id !== eventId);
            saveEvents(); // Isso já chamará displayUpcomingEvents()
            renderCalendar(); // Isso também chamará displayUpcomingEvents()
            if (selectedDayCell) {
                handleDayClick(selectedDayCell, selectedDayCell.dataset.date);
            }
            resetEditMode();
        }
    }

    // No listener do addEventButton, após saveEvents():
    addEventButton.addEventListener('click', () => {
        // ... (código existente) ...
        
        saveEvents(); // Isso já chamará displayUpcomingEvents()
        renderCalendar(); // Isso também chamará displayUpcomingEvents()
        
        // ... (restante do código) ...
    });

    // Certifique-se de que a chamada inicial também aconteça
    // renderCalendar(); // Já existe no final do script, e ele chama displayUpcomingEvents()

// ... (todo o restante do seu script.js) ...
    function renderCalendar() {
        calendarDaysElement.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        monthYearElement.textContent = `${currentDate.toLocaleString('pt-BR', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date(); 

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day-cell', 'empty');
            calendarDaysElement.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            const dayNumberSpan = document.createElement('span');
            dayNumberSpan.classList.add('day-number');
            dayNumberSpan.textContent = day;
            dayCell.appendChild(dayNumberSpan);

            const cellDateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dayCell.dataset.date = cellDateStr;

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('today');
            }

            const dayEvents = events.filter(event => event.date === cellDateStr);
            if (dayEvents.length > 0) {
                let primaryType = 'special'; 
                const typePriority = ['holiday', 'recess', 'pedagogical', 'vacation', 'user-event', 'special'];
                for (const type of typePriority) {
                    if (dayEvents.some(e => e.type === type)) {
                        primaryType = type;
                        break;
                    }
                }
                dayCell.classList.add(primaryType);

                dayEvents.forEach(event => {
                    const eventMarker = document.createElement('div');
                    eventMarker.classList.add('event-marker');
                    eventMarker.classList.add(event.type || 'special'); 
                    eventMarker.textContent = event.description.substring(0,15)+(event.description.length > 15 ? '...' : '');
                    dayCell.appendChild(eventMarker);
                });
            }
            
            dayCell.addEventListener('click', () => handleDayClick(dayCell, cellDateStr));
            calendarDaysElement.appendChild(dayCell);
        }
    }

    function handleDayClick(dayCell, dateStr) {
        if (selectedDayCell) {
            selectedDayCell.classList.remove('selected');
        }
        selectedDayCell = dayCell;
        selectedDayCell.classList.add('selected');

        const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'});
        selectedDateDisplayElement.textContent = formattedDate;
        eventDateInput.value = dateStr; // Preenche a data no formulário
        resetEditMode(); // Garante que não estamos em modo de edição ao selecionar um novo dia

        const dayEvents = events.filter(event => event.date === dateStr);
        eventListElement.innerHTML = '';
        if (dayEvents.length > 0) {
            dayEvents.forEach(event => {
                const listItem = document.createElement('li');
                
                const eventTextSpan = document.createElement('span');
                eventTextSpan.textContent = `${event.description} (${event.type || 'Letivo'})`;
                eventTextSpan.classList.add(event.type || 'special');
                listItem.appendChild(eventTextSpan);

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('event-actions');

                const editButton = document.createElement('button');
                editButton.classList.add('edit-btn');
                editButton.textContent = 'Editar';
                editButton.dataset.eventId = event.id;
                editButton.addEventListener('click', () => populateEditForm(event.id));
                actionsDiv.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.textContent = 'Excluir';
                deleteButton.dataset.eventId = event.id;
                deleteButton.addEventListener('click', () => deleteEventItem(event.id));
                actionsDiv.appendChild(deleteButton);
                
                listItem.appendChild(actionsDiv);
                eventListElement.appendChild(listItem);
            });
        } else {
            eventListElement.innerHTML = '<li>Nenhum evento para este dia.</li>';
        }
    }

    // NOVO: Função para preencher o formulário para edição
    function populateEditForm(eventId) {
        const eventToEdit = events.find(event => event.id === eventId);
        if (eventToEdit) {
            editingEventId = eventId;
            eventDateInput.value = eventToEdit.date;
            eventDateInput.disabled = true; // Desabilita a edição da data
            eventDescriptionInput.value = eventToEdit.description;
            eventTypeInput.value = eventToEdit.type || 'default';
            addEventButton.textContent = 'Salvar Alterações';
            eventDescriptionInput.focus();
        }
    }

    // NOVO: Função para resetar o modo de edição
    function resetEditMode() {
        editingEventId = null;
        eventDateInput.disabled = false;
        // eventDateInput.value = ''; // Não limpar a data, pois pode ser útil para adicionar novo
        eventDescriptionInput.value = '';
        eventTypeInput.value = 'default';
        addEventButton.textContent = 'Adicionar Evento';
    }

    // NOVO: Função para excluir um evento
    function deleteEventItem(eventId) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            events = events.filter(event => event.id !== eventId);
            saveEvents();
            renderCalendar();
            // Se um dia estiver selecionado, atualize a lista de eventos dele
            if (selectedDayCell) {
                handleDayClick(selectedDayCell, selectedDayCell.dataset.date);
            }
            resetEditMode(); // Caso estivesse editando o item excluído
        }
    }

    addEventButton.addEventListener('click', () => {
        const date = eventDateInput.value;
        const description = eventDescriptionInput.value.trim();
        const type = eventTypeInput.value;

        if (!date || !description) { // A data não será vazia se estiver editando e desabilitada
            alert('Por favor, preencha a data (se não estiver editando) e a descrição do evento.');
            return;
        }

        if (editingEventId) { // Estamos editando um evento existente
            const eventIndex = events.findIndex(event => event.id === editingEventId);
            if (eventIndex > -1) {
                events[eventIndex].description = description;
                events[eventIndex].type = type === 'default' ? 'user-event' : type;
                // A data não é alterada na edição por simplicidade (campo desabilitado)
            }
        } else { // Estamos adicionando um novo evento
            const newEvent = {
                id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID único mais robusto
                date,
                description,
                type: type === 'default' ? 'user-event' : type
            };
            events.push(newEvent);
        }
        
        saveEvents();
        renderCalendar();
        
        // Se o dia do evento (novo ou editado) estiver selecionado, atualize sua lista
        if (selectedDayCell && selectedDayCell.dataset.date === date) {
            handleDayClick(selectedDayCell, date);
        }
        
        resetEditMode(); // Limpa o formulário e reseta o modo de edição/adição
        if (selectedDayCell) { // Mantém a data do dia selecionado no input de data
            eventDateInput.value = selectedDayCell.dataset.date;
        }
    });

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        if (currentDate.getFullYear() < 2025) currentDate.setFullYear(2025, 0, 1);
        renderCalendar();
        clearSelectionAndForm();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (currentDate.getFullYear() > 2025) currentDate.setFullYear(2025, 11, 1);
        renderCalendar();
        clearSelectionAndForm();
    });
    
    // Modificado para também resetar o modo de edição
    function clearSelectionAndForm() {
        if (selectedDayCell) {
            selectedDayCell.classList.remove('selected');
            selectedDayCell = null;
        }
        selectedDateDisplayElement.textContent = '-';
        eventListElement.innerHTML = '<li>Nenhum evento para este dia.</li>';
        resetEditMode(); // Reseta o formulário de adição/edição
        eventDateInput.value = ''; // Limpa o campo de data ao mudar de mês
    }

    renderCalendar();
});
