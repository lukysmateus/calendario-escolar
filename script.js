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
    const upcomingEventListElement = document.getElementById('upcomingEventList');

    let currentDate = new Date(2025, 0, 1);
    let selectedDayCell = null;
    let editingEventId = null;

    let nextPredefinedId = 1;
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
        ...Array.from({length: 16}, (_, i) => { // Recesso Professores 14-29 Julho
            const day = i + 14;
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-07-${day.toString().padStart(2,'0')}`, description: 'Recesso Escolar para Professores', type: 'recess' };
        }),
        ...Array.from({length: 19}, (_, i) => { // Recesso Alunos 14 Julho - 01 Agosto
            const day = i + 14;
            if (day <= 31) { // Dias de Julho
                return { id: `predefined_${nextPredefinedId++}`, date: `2025-07-${day.toString().padStart(2,'0')}`, description: 'Recesso Escolar Para Alunos', type: 'recess' };
            }
            return null;
        }).filter(e => e !== null),
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-30', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-07-31', description: 'Encontro Pedagógico', type: 'pedagogical' },
        // Agosto 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-01', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-01', description: 'Recesso Escolar Para Alunos', type: 'recess' }, // Último dia
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-04', description: 'Início 2º semestre', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-09', description: 'Dia dos Pais (Evento - Sáb. Letivo)', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-08-16', description: 'Dom Bosco (Evento - Sáb. Letivo)', type: 'special' },
        ...Array.from({length: 10}, (_, i) => { // Av. Trimestral 18-22 e 25-29
            let day;
            if (i < 5) day = i + 18; else day = (i - 5) + 25;
            const desc = (day === 29) ? 'Avaliação Trimestral / Término 2º Trim.' : 'Avaliação Trimestral';
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-08-${day.toString().padStart(2,'0')}`, description: desc, type: 'special' };
        }),
        // Setembro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-09-01', description: 'Início 3º Trimestre', type: 'special' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-09-07', description: 'Independência do Brasil', type: 'holiday' },
        ...Array.from({length: 10}, (_, i) => { // Rec. Paralela 15-19 e 22-26
            let day;
            if (i < 5) day = i + 15; else day = (i - 5) + 22;
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-09-${day.toString().padStart(2,'0')}`, description: 'Recuperação Paralela', type: 'special' };
        }),
        // Outubro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-10-04', description: 'Mostra Cultural - FECITESB (Sáb. Letivo)', type: 'special' },
        ...Array.from({length: 9}, (_, i) => { // Av. Parcial 6-10 e 14-17
            let day;
            if (i < 5) day = i + 6; else day = (i - 5) + 14;
             return { id: `predefined_${nextPredefinedId++}`, date: `2025-10-${day.toString().padStart(2,'0')}`, description: 'Avaliação Parcial', type: 'special' };
        }),
        { id: `predefined_${nextPredefinedId++}`, date: '2025-10-12', description: 'N. S. Aparecida', type: 'holiday' },
        { id: `predefined_${nextPredefinedId++}`, date: '2025-10-13', description: 'Dia do Professor (Recesso/Comemoração)', type: 'recess' },
        // Novembro 2025
        { id: `predefined_${nextPredefinedId++}`, date: '2025-11-02', description: 'Finados', type: 'holiday' },
        ...Array.from({length: 8}, (_, i) => { // Av. Trimestral 10-14 e 17-19
            let day;
            if (i < 5) day = i + 10; else day = (i - 5) + 17;
            return { id: `predefined_${nextPredefinedId++}`, date: `2025-11-${day.toString().padStart(2,'0')}`, description: 'Avaliação Trimestral', type: 'special' };
        }),
        ...Array.from({length: 8}, (_, i) => { // Matrículas nas mesmas datas
            let day;
            if (i < 5) day = i + 10; else day = (i - 5) + 17;
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

    const storedEvents = localStorage.getItem('calendarEvents2025');
    if (storedEvents) {
        const userAddedEvents = JSON.parse(storedEvents).map(se => { // Use map para garantir ID
            if (!se.id) { // Atribui ID se não existir (para compatibilidade com storage antigo)
                se.id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            return se;
        }).filter(se => // Filtra para não adicionar duplicatas exatas dos predefinidos com ID
            !events.some(ie => ie.id === se.id)
        );
        events = events.concat(userAddedEvents);
    }


    function saveEvents() {
        localStorage.setItem('calendarEvents2025', JSON.stringify(events));
        displayUpcomingEvents();
    }
    
    function displayUpcomingEvents() {
        upcomingEventListElement.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);

        const upcoming = events.filter(event => {
            const eventDate = new Date(event.date + "T00:00:00");
            return eventDate >= today && eventDate < sevenDaysLater;
        }).sort((a, b) => new Date(a.date + "T00:00:00") - new Date(b.date + "T00:00:00"));

        if (upcoming.length > 0) {
            upcoming.forEach(event => {
                const listItem = document.createElement('li');
                const eventDateObj = new Date(event.date + "T00:00:00");
                const formattedDate = eventDateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
                
                listItem.innerHTML = `<span class="event-date-reminder">${formattedDate}:</span> ${event.description}`;
                listItem.classList.add(event.type || 'special');
                upcomingEventListElement.appendChild(listItem);
            });
        } else {
            upcomingEventListElement.innerHTML = '<li>Nenhum evento programado para os próximos 7 dias.</li>';
        }
    }

    function renderCalendar() {
        calendarDaysElement.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        monthYearElement.textContent = `${currentDate.toLocaleString('pt-BR', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayDate = new Date();
        todayDate.setHours(0,0,0,0); // Para comparação precisa com cellDate

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

            const cellDate = new Date(cellDateStr + "T00:00:00"); // Comparar com todayDate
            if (cellDate.getTime() === todayDate.getTime()) {
                dayCell.classList.add('today');
            }

            const dayEvents = events.filter(event => event.date === cellDateStr);
            if (dayEvents.length > 0) {
                let primaryType = 'special'; 
                const typePriority = ['holiday', 'recess', 'pedagogical', 'vacation', 'user-event', 'special'];
                for (const type of typePriority) {
                    if (dayEvents.some(e => e.type === type || (e.type === 'default' && type === 'user-event') )) { // 'default' de usuário vira 'user-event'
                        primaryType = type;
                        break;
                    }
                }
                dayCell.classList.add(primaryType);

                dayEvents.forEach(event => {
                    const eventMarker = document.createElement('div');
                    eventMarker.classList.add('event-marker');
                    eventMarker.classList.add(event.type === 'default' ? 'user-event' : (event.type || 'special')); 
                    eventMarker.textContent = event.description.substring(0,15)+(event.description.length > 15 ? '...' : '');
                    dayCell.appendChild(eventMarker);
                });
            }
            
            dayCell.addEventListener('click', () => handleDayClick(dayCell, cellDateStr));
            calendarDaysElement.appendChild(dayCell);
        }
        displayUpcomingEvents(); // Atualiza a lista de próximos eventos sempre que o calendário é renderizado
    }

    function handleDayClick(dayCell, dateStr) {
        if (selectedDayCell) {
            selectedDayCell.classList.remove('selected');
        }
        selectedDayCell = dayCell;
        selectedDayCell.classList.add('selected');

        const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'});
        selectedDateDisplayElement.textContent = formattedDate;
        eventDateInput.value = dateStr; 
        resetEditMode(); 

        const dayEvents = events.filter(event => event.date === dateStr);
        eventListElement.innerHTML = '';
        if (dayEvents.length > 0) {
            dayEvents.forEach(event => {
                const listItem = document.createElement('li');
                
                const eventTextSpan = document.createElement('span');
                eventTextSpan.textContent = `${event.description} (${event.type === 'default' ? 'Padrão (Letivo)' : (event.type || 'Letivo')})`;
                eventTextSpan.classList.add(event.type === 'default' ? 'user-event' : (event.type || 'special'));
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

    function populateEditForm(eventId) {
        const eventToEdit = events.find(event => event.id === eventId);
        if (eventToEdit) {
            editingEventId = eventId;
            eventDateInput.value = eventToEdit.date;
            eventDateInput.disabled = true; 
            eventDescriptionInput.value = eventToEdit.description;
            eventTypeInput.value = eventToEdit.type || 'default';
            addEventButton.textContent = 'Salvar Alterações';
            eventDescriptionInput.focus();
        }
    }

    function resetEditMode() {
        editingEventId = null;
        eventDateInput.disabled = false;
        // Não limpar eventDateInput.value aqui, pois pode ser o dia selecionado
        eventDescriptionInput.value = '';
        eventTypeInput.value = 'default';
        addEventButton.textContent = 'Adicionar Evento';
    }

    function deleteEventItem(eventId) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            const dateOfDeletedEvent = events.find(e => e.id === eventId)?.date;
            events = events.filter(event => event.id !== eventId);
            saveEvents();
            renderCalendar();
            
            if (selectedDayCell && selectedDayCell.dataset.date === dateOfDeletedEvent) {
                handleDayClick(selectedDayCell, dateOfDeletedEvent); // Atualiza a lista do dia selecionado
            } else if (selectedDayCell) {
                 // Se o dia selecionado não for o do evento deletado, apenas atualize a lista do dia selecionado
                handleDayClick(selectedDayCell, selectedDayCell.dataset.date);
            }
            resetEditMode(); 
        }
    }

    addEventButton.addEventListener('click', () => {
        const date = eventDateInput.value;
        const description = eventDescriptionInput.value.trim();
        let type = eventTypeInput.value; // Use let para poder modificar

        if (!date && !editingEventId) { // Se não estiver editando, a data é obrigatória
            alert('Por favor, selecione uma data para o novo evento.');
            return;
        }
        if (!description) {
            alert('Por favor, preencha a descrição do evento.');
            return;
        }
        
        // Se o tipo for 'default', internamente tratamos como 'user-event' para fins de estilo,
        // mas no select e na lógica de armazenamento pode continuar 'default' ou 'user-event'
        // A classe CSS .user-event será aplicada se o tipo for 'user-event' ou 'default' (adicionado pelo usuário).
        // Para consistência, vamos salvar como 'user-event' se for 'default'.
        if (type === 'default') {
            type = 'user-event';
        }


        if (editingEventId) {
            const eventIndex = events.findIndex(event => event.id === editingEventId);
            if (eventIndex > -1) {
                // A data não é alterada na edição (campo desabilitado)
                // Mas precisamos da data original do evento para atualizar a lista correta
                const originalDate = events[eventIndex].date;
                events[eventIndex].description = description;
                events[eventIndex].type = type;
                
                saveEvents();
                renderCalendar();
                if (selectedDayCell && selectedDayCell.dataset.date === originalDate) {
                    handleDayClick(selectedDayCell, originalDate);
                }
            }
        } else { 
            const newEvent = {
                id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                date,
                description,
                type
            };
            events.push(newEvent);
            saveEvents();
            renderCalendar();
            if (selectedDayCell && selectedDayCell.dataset.date === date) {
                handleDayClick(selectedDayCell, date);
            }
        }
        
        resetEditMode(); 
        // Após adicionar/salvar, se um dia estiver selecionado, mantenha a data no formulário
        if(selectedDayCell) {
            eventDateInput.value = selectedDayCell.dataset.date;
        } else {
            eventDateInput.value = ''; // Se nenhum dia selecionado, limpa a data
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
    
    function clearSelectionAndForm() {
        if (selectedDayCell) {
            selectedDayCell.classList.remove('selected');
            selectedDayCell = null;
        }
        selectedDateDisplayElement.textContent = '-';
        eventListElement.innerHTML = '<li>Nenhum evento para este dia.</li>';
        resetEditMode();
        eventDateInput.value = '';
    }

    renderCalendar(); // Chamada inicial para renderizar o calendário e os próximos eventos
});
