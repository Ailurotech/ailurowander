/**
 * @param {string} filename
 * @returns {string}
 */
export function getImageUrl(filename) {
  return `https://ailurowander-images.s3.ap-southeast-2.amazonaws.com/${filename}`;
}
