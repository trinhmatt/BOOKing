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
    default:
      return state;
  }
}
