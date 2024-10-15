import React from 'react';
import FullCalendar from '@fullcalendar/react'; // Importa o componente principal do calendário
import dayGridPlugin from '@fullcalendar/daygrid'; // Exibe o calendário no formato de grade
import timeGridPlugin from '@fullcalendar/timegrid'; // Exibe um calendário com as horas do dia
import interactionPlugin from '@fullcalendar/interaction'; // Permite interações, como arrastar e soltar
import './index.css'; // Importa um CSS personalizado, se necessário

const Calendario: React.FC = () => {
  const handleDateClick = (arg: any) => {
    alert('Data clicada: ' + arg.dateStr); // Exibe a data clicada no alerta
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Adiciona plugins necessários
        initialView="dayGridMonth" // Define a visualização inicial como grade mensal
        headerToolbar={{          // Define a barra de ferramentas do cabeçalho
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={true}            // Permite edição de eventos (arrastar e redimensionar)
        selectable={true}          // Permite selecionar datas e intervalos
        selectMirror={true}        // Visualização do seletor ao arrastar
        dayMaxEvents={true}        // Limita o número de eventos a serem exibidos por dia
        weekends={true}            // Exibe finais de semana
        events={[
          { title: 'Evento 1', start: '2023-10-01' },
          { title: 'Evento 2', start: '2023-10-05', end: '2023-10-07' },
          { title: 'Evento 3', start: '2023-10-09T10:30:00', end: '2023-10-09T12:30:00' }
        ]}
        dateClick={handleDateClick} // Chama a função ao clicar em uma data
      />
    </div>
  );
};

export default Calendario;
