import database from '../firebase/firebase';

export const setServices = ({startTime, endTime, services, uid}) => ({
  type: 'SET_SERVICES_AND_HOURS',
  startTime,
  endTime,
  services,
  uid
})

export const startSetServices = (servicesData = {}) => {
  return (dispatch, getState) => {

    const user = getState().auth.uid

    const services = {...servicesData, uid: user}

    return database.ref(`users/${user}`).push(services).then( () => {
      dispatch(setServices(services))
    })
  }
}
