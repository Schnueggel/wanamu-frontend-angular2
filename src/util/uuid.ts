/**
 * Generates pseudo random unique id
 * This should be enough randomness to be unique for our purpose
 * @return {string}
 */
export function uuid () {
    const time: number = new Date().getTime();
    const random: number = Math.random() * Math.random();

    return `${time}${random}`.replace(/\./, '');
}