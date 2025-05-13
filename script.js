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

    let currentDate = new Date(2025, 0, 1); // Start with Jan 2025
    let selectedDayCell = null;

    // --- Initial Events Data (from your image AND CORRECTIONS) ---
    // type: 'holiday', 'recess', 'pedagogical', 'vacation', 'special', 'user-event'
    let events = [
        // Janeiro 2025
        { date: '2025-01-01', description: 'Confraternização Universal', type: 'holiday' },
        ...Array.from({length: 16}, (_, i) => ({ date: `2025-01-${(i+2).toString().padStart(2,'0')}`, description: 'Férias (Alunos e Professores)', type: 'vacation'})), // Jan 2-17
        { date: '2025-01-20', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-01-21', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-01-22', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-01-23', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-01-24', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-01-27', description: 'Abertura do Ano Letivo / Início 1º Trim.', type: 'special' },
        { date: '2025-01-29', description: 'Início p/ Berçário', type: 'special' },
        { date: '2025-01-31', description: 'Missa de Dom Bosco', type: 'special' },

        // Fevereiro 2025
        { date: '2025-02-28', description: 'Baile de Carnaval', type: 'special' },

        // Março 2025
        { date: '2025-03-03', description: 'Recesso de Carnaval', type: 'recess' },
        { date: '2025-03-04', description: 'Carnaval', type: 'holiday' },
        { date: '2025-03-05', description: 'Quarta de Cinzas (Recesso)', type: 'recess' },
        { date: '2025-03-10', description: 'Conselho/Reunião de Pais (C.)', type: 'special' }, // Exemplo, manter ou remover conforme necessidade
        { date: '2025-03-11', description: 'Avaliação Parcial (Exemplo)', type: 'special' }, // Exemplo
        // ... Outros eventos de Março se houver

        // Abril 2025
        { date: '2025-04-17', description: 'Quinta Santa (Recesso)', type: 'recess' },
        { date: '2025-04-18', description: 'Paixão de Cristo', type: 'holiday' },
        { date: '2025-04-20', description: 'Páscoa', type: 'holiday' },
        { date: '2025-04-21', description: 'Tiradentes/Brasília', type: 'holiday' },
        { date: '2025-04-30', description: 'Término 1º Trimestre', type: 'special' },

        // Maio 2025 (COM ALTERAÇÕES)
        { date: '2025-05-01', description: 'Dia do Trabalho', type: 'holiday' },
        { date: '2025-05-02', description: 'Recesso Escolar', type: 'recess' },
        { date: '2025-05-05', description: 'Início 2º Trimestre', type: 'special' },
        { date: '2025-05-10', description: 'Dia das Mães (Sábado Letivo)', type: 'special' },
        { date: '2025-05-13', description: 'Madre Mazzarello', type: 'special' },
        { date: '2025-05-17', description: 'Reunião de Pais (Sábado Letivo)', type: 'special' },
        ...Array.from({length: 12}, (_, i) => { // 19 a 30 de Maio
            const day = i + 19;
            return { date: `2025-05-${day.toString().padStart(2,'0')}`, description: 'Recuperação Paralela', type: 'special' };
        }),
        { date: '2025-05-24', description: 'Festa de Maria (Sábado Letivo)', type: 'special' },
        { date: '2025-05-24', description: 'Recuperação Paralela', type: 'special' }, // Também é dia de Rec. Paralela

        // Junho 2025 (COM ALTERAÇÕES)
        { date: '2025-06-16', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-06-17', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-06-18', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-06-19', description: 'Corpus Christi', type: 'holiday' },
        { date: '2025-06-20', description: 'Recesso Escolar', type: 'recess' },
        { date: '2025-06-23', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-06-24', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-06-25', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-06-26', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-06-27', description: 'Avaliação Parcial', type: 'special' },

        // Julho 2025 (COM ALTERAÇÕES)
        { date: '2025-07-05', description: 'Festa Junina (Sábado Letivo)', type: 'special' },
        { date: '2025-07-07', description: 'JIESB', type: 'special' },
        { date: '2025-07-08', description: 'JIESB', type: 'special' },
        { date: '2025-07-09', description: 'JIESB', type: 'special' },
        { date: '2025-07-10', description: 'JIESB', type: 'special' },
        { date: '2025-07-11', description: 'JIESB / Término 1º semestre', type: 'special' },
        ...Array.from({length: 16}, (_, i) => { // 14 a 29 de Julho - Recesso Professores
            const day = i + 14;
            return { date: `2025-07-${day.toString().padStart(2,'0')}`, description: 'Recesso Escolar para Professores', type: 'recess' };
        }),
        ...Array.from({length: 19}, (_, i) => { // 14 Julho a 01 Agosto - Recesso Alunos (parte em Julho)
            const day = i + 14;
            if (day <= 31) {
                return { date: `2025-07-${day.toString().padStart(2,'0')}`, description: 'Recesso Escolar Para Alunos', type: 'recess' };
            }
            return null;
        }).filter(e => e !== null),
        { date: '2025-07-30', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-07-30', description: 'Recesso Escolar Para Alunos', type: 'recess' }, // Alunos ainda em recesso
        { date: '2025-07-31', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-07-31', description: 'Recesso Escolar Para Alunos', type: 'recess' }, // Alunos ainda em recesso

        // Agosto 2025 (COM ALTERAÇÕES)
        { date: '2025-08-01', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-08-01', description: 'Recesso Escolar Para Alunos', type: 'recess' }, // Último dia de recesso para alunos
        { date: '2025-08-04', description: 'Início 2º semestre', type: 'special' },
        { date: '2025-08-09', description: 'Dia dos Pais (Evento - Sáb. Letivo)', type: 'special' },
        { date: '2025-08-16', description: 'Dom Bosco (Evento - Sáb. Letivo)', type: 'special' },
        { date: '2025-08-18', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-19', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-20', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-21', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-22', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-25', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-26', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-27', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-28', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-08-29', description: 'Avaliação Trimestral / Término 2º Trim.', type: 'special' },

        // Setembro 2025 (COM ALTERAÇÕES)
        { date: '2025-09-01', description: 'Início 3º Trimestre', type: 'special' },
        // { date: '2025-09-02', description: 'Conselho/Reunião de Pais (C.)', type: 'special' }, // Manter ou remover
        { date: '2025-09-07', description: 'Independência do Brasil', type: 'holiday' },
        { date: '2025-09-15', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-16', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-17', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-18', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-19', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-22', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-23', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-24', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-25', description: 'Recuperação Paralela', type: 'special' },
        { date: '2025-09-26', description: 'Recuperação Paralela', type: 'special' },

        // Outubro 2025 (COM ALTERAÇÕES)
        { date: '2025-10-04', description: 'Mostra Cultural - FECITESB (Sáb. Letivo)', type: 'special' },
        { date: '2025-10-06', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-10-07', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-10-08', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-10-09', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-10-10', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-10-12', description: 'N. S. Aparecida', type: 'holiday' },
        { date: '2025-10-13', description: 'Dia do Professor (Recesso/Comemoração)', type: 'recess' },
        { date: '2025-10-14', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-10-15', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-10-16', description: 'Avaliação Parcial', type: 'special' },
        { date: '2025-10-17', description: 'Avaliação Parcial', type: 'special' },
        
        // Novembro 2025 (COM ALTERAÇÕES)
        { date: '2025-11-02', description: 'Finados', type: 'holiday' },
        { date: '2025-11-10', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-11-10', description: 'Início Matrículas p/2026', type: 'special' },
        { date: '2025-11-11', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-11-11', description: 'Matrículas p/2026', type: 'special' },
        { date: '2025-11-12', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-11-12', description: 'Matrículas p/2026', type: 'special' },
        { date: '2025-11-13', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-11-13', description: 'Matrículas p/2026', type: 'special' },
        { date: '2025-11-14', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-11-14', description: 'Matrículas p/2026', type: 'special' },
        { date: '2025-11-15', description: 'Proclamação da República', type: 'holiday' },
        { date: '2025-11-17', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-11-17', description: 'Matrículas p/2026', type: 'special' },
        { date: '2025-11-18', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-11-18', description: 'Matrículas p/2026', type: 'special' },
        { date: '2025-11-19', description: 'Avaliação Trimestral', type: 'special' },
        { date: '2025-11-19', description: 'Matrículas p/2026', type: 'special' },
        { date: '2025-11-20', description: 'Consciência Negra', type: 'holiday' },
        { date: '2025-11-21', description: 'Recesso Escolar', type: 'recess' },
        // { date: '2025-11-25', description: 'Conselho/Reunião de Pais (C.)', type: 'special' }, // Manter ou remover
        { date: '2025-11-30', description: 'Dia do Evangélico', type: 'holiday' },

        // Dezembro 2025
        { date: '2025-12-08', description: 'Recuperação Final - EF e EM', type: 'special' },
        { date: '2025-12-09', description: 'Recuperação Final - EF e EM', type: 'special' },
        { date: '2025-12-10', description: 'Recuperação Final - EF e EM', type: 'special' },
        // { date: '2025-12-11', description: 'Conselho/Reunião de Pais (C.)', type: 'special' }, // Manter ou remover
        { date: '2025-12-12', description: 'Término 3º Trimestre / Término Ano Letivo', type: 'special' },
        { date: '2025-12-15', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-12-16', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-12-17', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-12-18', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-12-19', description: 'Encontro Pedagógico', type: 'pedagogical' },
        { date: '2025-12-25', description: 'Natal', type: 'holiday' },
    ];

    // Load events from localStorage
    const storedEvents = localStorage.getItem('calendarEvents2025');
    if (storedEvents) {
        // Filter out any duplicates that might have been pre-loaded if the structure is identical
        const userAddedEvents = JSON.parse(storedEvents).filter(se => 
            !events.some(ie => ie.date === se.date && ie.description === se.description && ie.type === se.type)
        );
        events = events.concat(userAddedEvents);
    }

    function saveEvents() {
        localStorage.setItem('calendarEvents2025', JSON.stringify(events));
    }
    
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
                if (dayEvents.some(e => e.type === 'holiday')) primaryType = 'holiday';
                else if (dayEvents.some(e => e.type === 'recess')) primaryType = 'recess';
                else if (dayEvents.some(e => e.type === 'pedagogical')) primaryType = 'pedagogical';
                else if (dayEvents.some(e => e.type === 'vacation')) primaryType = 'vacation';
                else if (dayEvents.some(e => e.type === 'user-event')) primaryType = 'user-event';
                
                // Ensure specific types take precedence for cell background if multiple events exist
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
        eventDateInput.value = dateStr;

        const dayEvents = events.filter(event => event.date === dateStr);
        eventListElement.innerHTML = '';
        if (dayEvents.length > 0) {
            dayEvents.forEach(event => {
                const listItem = document.createElement('li');
                listItem.textContent = `${event.description} (${event.type || 'Letivo'})`;
                listItem.classList.add(event.type || 'special');
                eventListElement.appendChild(listItem);
            });
        } else {
            eventListElement.innerHTML = '<li>Nenhum evento para este dia.</li>';
        }
    }

    addEventButton.addEventListener('click', () => {
        const date = eventDateInput.value;
        const description = eventDescriptionInput.value.trim();
        const type = eventTypeInput.value;

        if (!date || !description) {
            alert('Por favor, preencha a data e a descrição do evento.');
            return;
        }

        events.push({ date, description, type: type === 'default' ? 'user-event' : type });
        saveEvents();
        renderCalendar();
        
        if (selectedDayCell && selectedDayCell.dataset.date === date) {
            handleDayClick(selectedDayCell, date);
        }
        
        eventDescriptionInput.value = '';
    });

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        if (currentDate.getFullYear() < 2025) currentDate.setFullYear(2025, 0, 1);
        renderCalendar();
        clearSelection();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (currentDate.getFullYear() > 2025) currentDate.setFullYear(2025, 11, 1);
        renderCalendar();
        clearSelection();
    });
    
    function clearSelection() {
        if (selectedDayCell) {
            selectedDayCell.classList.remove('selected');
            selectedDayCell = null;
        }
        selectedDateDisplayElement.textContent = '-';
        eventListElement.innerHTML = '<li>Nenhum evento para este dia.</li>';
        eventDateInput.value = '';
    }

    renderCalendar();
});