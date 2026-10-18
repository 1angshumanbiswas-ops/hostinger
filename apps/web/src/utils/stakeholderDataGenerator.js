export const getCommunications = async () => {
  return [
    {
      id: 1,
      date: new Date().toISOString(),
      type: 'Meeting Notes',
      title: 'Weekly Sync: Leadership',
      attendees: ['John D.', 'Sarah M.', 'Mike R.'],
      summary: 'Discussed Q3 roadmaps and budget approvals. API migration is prioritized.',
      actionItems: ['Draft PRD for API', 'Review budget allocation']
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      type: 'Status Update',
      title: 'Sprint 42 Completion',
      attendees: ['Engineering Team'],
      summary: 'Sprint completed with 95% of committed points delivered. 2 bugs rolled over.',
      actionItems: ['Retrospective on Friday']
    }
  ];
};