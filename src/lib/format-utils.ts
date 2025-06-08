/**
 * Formats a level code by combining the matrix level code prefix with the numeric level
 */
export const formatLevelCode = (matrixLevelCode: string, numericLevel: number) => {
  return `${matrixLevelCode}${numericLevel}`;
};
