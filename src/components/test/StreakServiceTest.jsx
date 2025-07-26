import React from 'react';
import { streakService } from '../../services/streakService';

function StreakServiceTest() {
  const testService = () => {
    console.log('streakService:', streakService);
    console.log('streakService methods:', Object.keys(streakService));
    console.log('getUserQuizCalendar exists:', typeof streakService.getUserQuizCalendar);
    console.log('getUserQuizCalendar function:', streakService.getUserQuizCalendar);
  };

  React.useEffect(() => {
    testService();
  }, []);

  return (
    <div className="bg-yellow-100 p-4 rounded mb-4">
      <h3 className="font-bold">Streak Service Test</h3>
      <button 
        onClick={testService}
        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
      >
        Test Service
      </button>
      <p className="text-sm mt-2">Check console for results</p>
    </div>
  );
}

export default StreakServiceTest;
