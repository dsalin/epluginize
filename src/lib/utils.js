/**
* Simple utility function to wrap
* other functions that may throw errors directly,
* which prevents from stopping the whole application
* 
* @function
*/
import chalk from 'chalk'

const wrapPossibleError = func => ( ...params ) => {
  try {
    return func.apply(this, params)
  } catch (err) {
    return err
  }
}

export default {
  wrapPossibleError
}
