import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, GraduationCap, Home } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const navigate = useNavigate();
  const { classId, subjectId } = useParams();

  useEffect(() => {
    fetchClasses();
  }, []);

  // Sync state with URL params
  useEffect(() => {
    if (classes.length > 0) {
        if (classId) {
            const cls = classes.find(c => c.id === classId);
            if (cls) {
                setSelectedClass(cls);
                fetchSubjects(cls.id);
            }
        } else {
             setSelectedClass(null);
             setSubjects([]);
        }
    }
  }, [classId, classes]);

  const fetchClasses = async () => {
    try {
        const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
        
        if (error) {
            console.error("Error fetching classes:", error);
            return;
        }
        if (data) {
            setClasses(data);
        }
    } catch (e) {
        console.error("Exception fetching classes:", e);
    }
  };

  const fetchSubjects = async (clsId) => {
    try {
        const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('class_id', clsId)
        .order('name');
        
        if (error) {
            console.error("Error fetching subjects:", error);
            return;
        }
        if (data) {
            setSubjects(data);
        }
    } catch (e) {
        console.error("Exception fetching subjects:", e);
    }
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setShowClassDropdown(false);
    // Reset subject when class changes
    setSubjects([]); 
    fetchSubjects(classItem.id);
    setShowSubjectDropdown(true); // Open subject dropdown to encourage next step
  };

  const handleSubjectSelect = (subject) => {
    setShowSubjectDropdown(false);
    navigate(`/class/${selectedClass.id}/subject/${subject.id}`);
  };

  const activeSubjectName = subjects.find(s => s.id === subjectId)?.name;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/education')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">EduLearn</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Quality Education for All</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
             <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => navigate('/education')}
             >
                <Home className="w-4 h-4 mr-2" />
                Home
             </Button>

            {/* Class Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base border border-blue-100"
              >
                <BookOpen className="w-4 h-4" />
                <span>{selectedClass ? selectedClass.name : 'Select Class'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showClassDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showClassDropdown && (
                  <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowClassDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-20 max-h-64 overflow-y-auto"
                  >
                    {classes.map((classItem) => (
                      <button
                        key={classItem.id}
                        onClick={() => handleClassSelect(classItem)}
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0 text-sm ${
                            selectedClass?.id === classItem.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        {classItem.name}
                      </button>
                    ))}
                  </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Subject Dropdown */}
            <div className="relative">
              <button
                onClick={() => selectedClass && setShowSubjectDropdown(!showSubjectDropdown)}
                disabled={!selectedClass}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base border ${
                  selectedClass
                    ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-100 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{activeSubjectName || 'Select Subject'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSubjectDropdown && selectedClass && (
                  <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSubjectDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-20 max-h-64 overflow-y-auto"
                  >
                    {subjects.length > 0 ? (
                        subjects.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => handleSubjectSelect(subject)}
                            className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0 text-sm ${
                                subjectId === subject.id ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-700'
                            }`}
                        >
                            {subject.name}
                        </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-slate-400 italic">No subjects available</div>
                    )}
                  </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;