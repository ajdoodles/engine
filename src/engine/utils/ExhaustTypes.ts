/**
 * If this method is causing you a type error claiming a type is
 * not assignable to 'never', then you likely have a switch statement
 * with at least missing case, that is to say at least one type
 * of all the possible types of the object you are checking is not
 * defined in your switch statement.
 * @param toCheck the object to exhaustively check
 * @param message string to print in case of error
 */
export default function assertExhaustive(toCheck: never, message = "Cases must be defined for all possible types of ") : never {
    throw Error(message + toCheck);
}