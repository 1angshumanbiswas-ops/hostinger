export const getRisksAndIssues = async () => {
  return {
    risks: [
      { id: 'R1', title: 'API Rate Limiting', probability: 'High', impact: 'High', severity: 'High', mitigation: 'Implement Redis caching layer' },
      { id: 'R2', title: 'Key Resource Departure', probability: 'Medium', impact: 'High', severity: 'Medium', mitigation: 'Cross-training and documentation' },
      { id: 'R3', title: 'Scope Creep on UI', probability: 'High', impact: 'Medium', severity: 'Medium', mitigation: 'Strict change control process' }
    ],
    issues: [
      { id: 'I1', title: 'Staging Environment Down', priority: 'Critical', status: 'In Progress', owner: 'DevOps' },
      { id: 'I2', title: 'Vendor API Deprecation', priority: 'High', status: 'Open', owner: 'Backend Lead' }
    ]
  };
};