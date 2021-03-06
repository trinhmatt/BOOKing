const usersDefaultState = {};

export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_SERVICES_AND_HOURS':
      const newUserSettings = {
        operatingHours: {
          start: action.startTime,
          end: action.endTime
        },
        services: action.services
      }
      return {
        ...state,
        [action.uid]: newUserSettings
      }
    case 'GET_SETTINGS':
      return {...action.settings}
    case 'DISABLE_BOOKINGS':
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          unavailableDays: action.unavailableDays
        }
      }
    default:
      return state;
  }
}
