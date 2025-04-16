import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FeedbackForm = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNumber.trim() || !issueType || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate roll number format
    const rollNumberPattern = /^[0-9A-Z]{1,12}$/i;
    if (!rollNumberPattern.test(rollNumber)) {
      toast.error("Please enter a valid roll number format");
      return;
    }
    
    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real application, this would send the form data to your backend
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Your feedback has been submitted. We'll look into this issue soon!");
      
      // Reset form
      setRollNumber('');
      setIssueType('');
      setDescription('');
      setEmail('');
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Report an Issue</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <Input 
              id="rollNumber" 
              placeholder="Enter your roll number" 
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required 
            />
          </div>
          
          <div>
            <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Type <span className="text-red-500">*</span>
            </label>
            <Select value={issueType} onValueChange={setIssueType} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance not showing</SelectItem>
                <SelectItem value="midmarks">Mid marks not showing</SelectItem>
                <SelectItem value="details">Student details not showing</SelectItem>
                <SelectItem value="rollnumber">Roll number not found</SelectItem>
                <SelectItem value="other">Other issue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea 
              id="description" 
              placeholder="Please describe the issue you're facing" 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address (optional)
            </label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email for follow-up" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-nbkr hover:bg-nbkr-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
