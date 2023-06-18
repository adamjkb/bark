import { ABC, STEP_LENGTH } from './consts.js'

/**
 * Truncate path to a certain depth
 * @param {Object} args
 * @param {string} args.path
 * @param {number} args.depth
 * @returns {string}
 */
export const path_from_depth = ({ path, depth }) => path.slice(0, depth * STEP_LENGTH)


/**
 * Decodes path-like string to integer
 * @param {string} str
 * @returns {number}
*/
export const str2int = (str) => parseInt(str, ABC.length)


/**
 * Encodes integer to path-like string
 * @param {number} int
 * @returns {string}
*/
export const int2str = (int) => Number(int).toString(ABC.length).padStart(STEP_LENGTH, ABC.at(0)).toUpperCase()


/**
 * Increment given path's last step
 * @param {string} path
 * @returns {string}
*/
export const increment_path = (path) => {
	const parent_path = path.slice(0, path.length - STEP_LENGTH)
	// convert last step of last sibling to integer
	const step_int = str2int(path.slice(-STEP_LENGTH))
	const new_step = int2str(step_int + 1)

	// throw if path is outside of Step length boundary
	if (new_step.length > STEP_LENGTH) {
		throw new Error(`Path "${new_step}" is overflowing step boundaries`)
	}

	// create next path
	const new_path = parent_path + new_step
	return new_path
}

/**
 * @param {Object} args
 * @param {string} args.path
 * @returns {number}
 */
export const last_position_in_path = ({path}) => str2int(path.slice(-STEP_LENGTH))