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

    return database.ref(`users/${user}`).set({settings: services}).then( () => {
      dispatch(setServices(services))
    })
  }
}

export const getSettings = (settings) => ({
  type: 'GET_SETTINGS',
  settings
})

export const startGetSettings = () => {
  return (dispatch) => {
    return database.ref(`users`).once('value').then((snapshot) => {
      const settings = snapshot.val()
      dispatch(getSettings(settings))
    })
  }
}

export const startCreateBooking = (booking, uid) => {
  return (dispatch) => {
    const databaseBooking = {[booking.time]: booking.service}
    const stateBooking = {service: booking.service, time: booking.time, date: booking.date, uid: uid}
    return database.ref(`users/${uid}/bookings/${booking.date}`).update(databaseBooking)
  }
}
