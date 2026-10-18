import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([
    { id: 1001, fullName: 'Alice Johnson', department: 'IT', designation: 'Frontend Developer', performance: 'High', isEditing: false },
    { id: 1002, fullName: 'Bob Smith', department: 'Operations', designation: 'Operations Manager', performance: 'Mid', isEditing: false },
    { id: 1003, fullName: 'Charlie Davis', department: 'HR', designation: 'HR Specialist', performance: 'High', isEditing: false },
    { id: 1004, fullName: 'Diana Evans', department: 'Finance', designation: 'Financial Analyst', performance: 'High', isEditing: false },
    { id: 1005, fullName: 'Ethan Hunt', department: 'IT', designation: 'Backend Developer', performance: 'Mid', isEditing: false },
    { id: 1006, fullName: 'Fiona Gallagher', department: 'Operations', designation: 'Logistics Coordinator', performance: 'Low', isEditing: false },
    { id: 1007, fullName: 'George Miller', department: 'HR', designation: 'Recruiter', performance: 'Mid', isEditing: false },
    { id: 1008, fullName: 'Hannah Abbott', department: 'Finance', designation: 'Accountant', performance: 'High', isEditing: false },
    { id: 1009, fullName: 'Ian Malcolm', department: 'IT', designation: 'DevOps Engineer', performance: 'High', isEditing: false },
    { id: 1010, fullName: 'Julia Roberts', department: 'Operations', designation: 'Operations Specialist', performance: 'Mid', isEditing: false },
    { id: 1011, fullName: 'Kevin Spacey', department: 'IT', designation: 'QA Tester', performance: 'Low', isEditing: false },
    { id: 1012, fullName: 'Laura Dern', department: 'Finance', designation: 'Finance Manager', performance: 'High', isEditing: false },
  ]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Derived Pagination Data
  const totalPages = Math.max(1, Math.ceil(employees.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentEmployees = employees.slice(startIndex, startIndex + rowsPerPage);

  const handleAddRecord = () => {
    const nextId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1000;
    const newRecord = {
      id: nextId,
      fullName: '',
      department: '',
      designation: '',
      performance: '',
      isEditing: true
    };
    const updatedEmployees = [...employees, newRecord];
    setEmployees(updatedEmployees);
    
    // Jump to the last page so the user can see the newly added record
    const newTotalPages = Math.max(1, Math.ceil(updatedEmployees.length / rowsPerPage));
    setCurrentPage(newTotalPages);
  };

  const handleChange = (id, field, value) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const toggleEdit = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, isEditing: !emp.isEditing } : emp
    ));
  };

  const deleteRecord = (id) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    
    // Adjust current page if the last item on the current page is deleted
    const newTotalPages = Math.max(1, Math.ceil(updatedEmployees.length / rowsPerPage));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Angshuman AI Corp ERP Employees</h2>
          <p className="text-muted-foreground mt-1">Manage and update employee records and performance scores.</p>
        </div>
        <Button 
          onClick={handleAddRecord}
          className="bg-[#1f5233] text-white hover:bg-[#173d26] font-medium shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          ADD NEW RECORD
        </Button>
      </div>

      <Card className="bg-card shadow-sm border-border">
        <CardHeader className="pb-0 border-b border-border/50 mb-4">
          <CardTitle className="text-lg font-bold pb-4">Workforce Data Repository</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px] font-semibold text-foreground">ID</TableHead>
                  <TableHead className="min-w-[200px] font-semibold text-foreground">Full Name</TableHead>
                  <TableHead className="min-w-[150px] font-semibold text-foreground">Department</TableHead>
                  <TableHead className="min-w-[180px] font-semibold text-foreground">Designation</TableHead>
                  <TableHead className="min-w-[120px] font-semibold text-foreground">Performance</TableHead>
                  <TableHead className="w-[120px] text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No employee records found in Angshuman AI Corp ERP.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentEmployees.map((emp) => (
                    <TableRow key={emp.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        {emp.isEditing ? (
                          <Input 
                            type="number"
                            value={emp.id}
                            onChange={(e) => handleChange(emp.id, 'id', parseInt(e.target.value) || '')}
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span className="font-medium text-muted-foreground">#{emp.id}</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {emp.isEditing ? (
                          <Input 
                            type="text"
                            value={emp.fullName}
                            onChange={(e) => handleChange(emp.id, 'fullName', e.target.value)}
                            placeholder="Enter full name"
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span className="font-medium">{emp.fullName || '—'}</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {emp.isEditing ? (
                          <Select 
                            value={emp.department} 
                            onValueChange={(value) => handleChange(emp.id, 'department', value)}
                          >
                            <SelectTrigger className="h-9 w-full bg-background">
                              <SelectValue placeholder="Select Dept" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {emp.department || '—'}
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {emp.isEditing ? (
                          <Input 
                            type="text"
                            value={emp.designation}
                            onChange={(e) => handleChange(emp.id, 'designation', e.target.value)}
                            placeholder="Enter designation"
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">{emp.designation || '—'}</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {emp.isEditing ? (
                          <Select 
                            value={emp.performance} 
                            onValueChange={(value) => handleChange(emp.id, 'performance', value)}
                          >
                            <SelectTrigger className="h-9 w-full bg-background">
                              <SelectValue placeholder="Rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Mid">Mid</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                            ${emp.performance === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                              emp.performance === 'Mid' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                              emp.performance === 'Low' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' : 
                              'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}
                          >
                            {emp.performance || '—'}
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {emp.isEditing ? (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleEdit(emp.id)}
                              className="h-8 w-8 text-[#1f5233] hover:text-[#173d26] hover:bg-[#1f5233]/10"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleEdit(emp.id)}
                              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteRecord(emp.id)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              Showing {employees.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + rowsPerPage, employees.length)} of {employees.length} entries
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 ${
                  currentPage === 1 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 opacity-70' 
                    : 'bg-green-700 text-white hover:bg-green-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <span className="text-sm font-medium text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 ${
                  currentPage === totalPages 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 opacity-70' 
                    : 'bg-green-700 text-white hover:bg-green-800'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}