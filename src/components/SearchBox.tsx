import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SearchBox = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNumber.trim()) {
      toast.error("Please enter a roll number");
      return;
    }
    
    // For demonstration, we'll use a regex pattern to validate roll number format
    // This should be customized based on your college's roll number format
    const rollNumberPattern = /^[0-9A-Z]{1,12}$/i;
    
    if (!rollNumberPattern.test(rollNumber)) {
      toast.error("Please enter a valid roll number format");
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, you would call your backend API here
    // For now, we'll simulate a backend call with a timeout
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/student/${rollNumber}`);
    }, 1000);
  };

  return (
    <div className="search-container animate-fade-in">
      <form onSubmit={handleSearch} className="flex flex-col space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter your roll number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full"
            autoComplete="off"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-nbkr hover:bg-nbkr-dark"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>
    </div>
  );
};

export default SearchBox;
