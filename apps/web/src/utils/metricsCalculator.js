export const calculateKPIs = (tasks = [], risks = []) => {
  const completedTasks = tasks.filter(t => t.completed || t.status === 'done').length;
  const totalTasks = tasks.length || 1;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const highRisks = risks.filter(r => r.severity === 'High').length;

  return {
    completionRate,
    highRisks,
    scheduleVariance: completionRate >= 80 ? '+2%' : '-5%',
    budgetVariance: '-1.5%',
    overallHealth: completionRate > 75 && highRisks < 3 ? 'Good' : 'Needs Attention'
  };
};

export const generateTrendData = () => {
  return Array.from({ length: 6 }).map((_, i) => ({
    name: `Week ${i + 1}`,
    velocity: Math.floor(Math.random() * 20) + 30,
    bugs: Math.floor(Math.random() * 10) + 2
  }));
};