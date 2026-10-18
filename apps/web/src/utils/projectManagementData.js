export const getProjectData = async () => {
  // Fetching real task data from free API as requested
  let apiTasks = [];
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=8');
    apiTasks = await res.json();
  } catch (err) {
    console.error("Error fetching tasks", err);
  }

  const sprints = [
    { name: 'Sprint 41', points: 45, completed: 42 },
    { name: 'Sprint 42', points: 48, completed: 45 },
    { name: 'Sprint 43', points: 50, completed: 20 }
  ];

  return {
    tasks: apiTasks.map(t => ({
      id: t.id,
      title: t.title,
      status: t.completed ? 'Done' : 'In Progress',
      assignee: `User ${t.userId}`
    })),
    sprints,
    velocity: 43.5
  };
};