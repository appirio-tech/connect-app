/**
 * Get a project summary
 *
 * @param  {integer} projectId unique identifier of the project
 */
export function getProjectSummary(projectId) {
  return Promise.resolve({
    projectId,
    budget: {
      work: 40250,
      fees: 10430,
      revenue: 40250,
      remaining: 19750
    },
    topcoderDifference: {
      countries: 12,
      registrants: 165,
      designs: 38,
      linesOfCode: 1500000,
      hoursSaved: 450,
      costSavings: 45000,
      valueCreated: 670000
    }
  })
}
