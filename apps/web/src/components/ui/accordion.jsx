import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = createContext({});
const AccordionItemContext = createContext({});

export const Accordion = ({ 
  type = "single", 
  collapsible = false, 
  defaultValue, 
  className, 
  children 
}) => {
  const [value, setValue] = useState(defaultValue || (type === "multiple" ? [] : ""));

  const handleToggle = (itemValue) => {
    if (type === "multiple") {
      setValue((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        return current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
      });
    } else {
      setValue((prev) => (prev === itemValue && collapsible ? "" : itemValue));
    }
  };

  return (
    <AccordionContext.Provider value={{ value, handleToggle, type }}>
      <div className={cn("space-y-2", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ value, className, children }) => {
  const { value: selectedValue } = useContext(AccordionContext);
  const isOpen = Array.isArray(selectedValue) 
    ? selectedValue.includes(value) 
    : selectedValue === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn("border-b border-border bg-card rounded-lg px-4 shadow-sm", className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionTrigger = ({ className, children }) => {
  const { handleToggle } = useContext(AccordionContext);
  const { value, isOpen } = useContext(AccordionItemContext);

  return (
    <button
      type="button"
      role="button"
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${value}`}
      id={`accordion-trigger-${value}`}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-semibold transition-all hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      onClick={() => handleToggle(value)}
    >
      {children}
      <ChevronDown 
        className={cn(
          "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300", 
          isOpen && "rotate-180 text-primary"
        )} 
      />
    </button>
  );
};

export const AccordionContent = ({ className, children }) => {
  const { value, isOpen } = useContext(AccordionItemContext);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current?.scrollHeight || 0);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      id={`accordion-content-${value}`}
      role="region"
      aria-labelledby={`accordion-trigger-${value}`}
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
    >
      <div ref={contentRef} className={cn("pb-4 pt-1", className)}>
        {children}
      </div>
    </div>
  );
};