import { getProjectData } from './projectManagementData';
import { getRisksAndIssues } from './riskManagementData';
import { getCommunications } from './stakeholderDataGenerator';
import { calculateKPIs, generateTrendData } from './metricsCalculator';

export const fetchProgramData = async () => {
  try {
    const [projectData, riskData, commsData] = await Promise.all([
      getProjectData(),
      getRisksAndIssues(),
      getCommunications()
    ]);

    const kpis = calculateKPIs(projectData.tasks, riskData.risks);
    const trends = generateTrendData();

    return {
      success: true,
      data: {
        projects: projectData,
        risks: riskData,
        communications: commsData,
        kpis,
        trends
      }
    };
  } catch (error) {
    console.error('Failed to fetch program data:', error);
    return { success: false, error: error.message };
  }
};