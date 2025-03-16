import axios from 'axios';
import { useEffect, useState } from 'react';

function CalendarView() {
  const [allocations, setAllocations] = useState([]);

  console.log(allocations);

  const getAllocations = async () => {
    const response = await axios.get(`https://localhost:9926/Users/?select(name,totalValue,allocations)`);
    if (response?.data) {
      const orderedWeeks = [];
      response.data.map((user) => orderedWeeks.push(...user.allocations.map((a) => ({ ...a, name: user.name }))));
      setAllocations(orderedWeeks.sort((a, b) => a.id - b.id));
    }
  }

  useEffect(() => {
    getAllocations();
  }, [])

  return (
    <div id="calendar">
      hi
    </div>
  );
}

export default CalendarView;
