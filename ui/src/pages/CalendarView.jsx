import Calendar from 'react-calendar';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import useLocalStorageState from 'use-local-storage-state';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px;

  .react-calendar {
    width: 800px;
    background-color: #424242;
    border: none;
    border-radius: 8px;
    padding: 20px;
    color: white;

    .react-calendar__tile {
      color: white;
      
      &:enabled:hover,
      &:enabled:focus {
        background-color: #616161;
      }
    }

    .react-calendar__month-view__days__day--weekend {
      color: #ff4081;
    }

    .react-calendar__tile--active {
      background-color: #1976d2;
    }
  }
`;

function CalendarView() {
  return (
    <Container>
      <CalendarContainer>
        <Calendar />
      </CalendarContainer>
    </Container>
  );
}

export default CalendarView;
