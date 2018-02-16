import database from '../firebase/firebase';

export const setServices = ({
  startTime,
  endTime,
  services,
  uid,
  displayName,
  weeklyAvailability
}) => ({
  type: 'SET_SERVICES_AND_HOURS',
  startTime,
  endTime,
  services,
  uid,
  displayName,
  weeklyAvailability
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

export const startCreateBooking = (booking, uid, uuid) => {
  return (dispatch) => {
    const databaseBooking = {
      [uuid]: {
        ...booking.service,
        client: booking.client
      }
    }
    const stateBooking = {service: booking.service, time: booking.service.time, date: booking.date, uid: uid}
    return database.ref(`users/${uid}/bookings/${booking.date}`).update(databaseBooking)
  }
}

export const disableBookings = (unavailableDays, uid) => ({
  type: 'DISABLE_BOOKINGS',
  unavailableDays,
  uid
})

export const startDisableBookings = (unavailableDays, uid) => {
  return (dispatch) => {
    return database.ref(`users/${uid}/settings/unavailableDays`).update(unavailableDays).then(
      () => {
        dispatch(disableBookings(unavailableDays, uid))
      }
    )
  }
}

export const startCancelBooking = (date, uid, bookingID) => {
  return (dispatch) => {
    return database.ref(`users/${uid}/bookings/${date}/${bookingID}`).remove().then(
      () => {
        dispatch(startGetSettings())
      }
    )
  }
}
