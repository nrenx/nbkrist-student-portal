import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { submitLogo } from '@/services/logoService';

interface LogoSubmissionFormProps {
  onSubmitSuccess: () => void;
}

const LogoSubmissionForm: React.FC<LogoSubmissionFormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderEmail, setUploaderEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name.trim()) {
      toast.error('Please enter a logo name');
      return;
    }

    if (!image) {
      toast.error('Please select an image');
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit the logo
      await submitLogo({
        name: name.trim(),
        description: description.trim(),
        image,
        uploader_name: uploaderName.trim(),
        uploader_email: uploaderEmail.trim()
      });

      toast.success('Logo submitted successfully! It will be reviewed by an admin.');
      
      // Reset form
      setName('');
      setDescription('');
      setUploaderName('');
      setUploaderEmail('');
      setImage(null);
      setImagePreview(null);
      
      // Notify parent component
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting logo:', error);
      toast.error('Failed to submit logo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('File must be an image');
        return;
      }
      
      setImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Logo Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., NBKRIST Official Logo"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the logo"
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Logo Image *</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image')?.click()}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Image className="h-4 w-4" />
            {image ? 'Change Image' : 'Upload Image'}
          </Button>
          {image && (
            <Button
              type="button"
              variant="ghost"
              onClick={removeImage}
              disabled={isSubmitting}
              className="text-destructive"
            >
              Remove
            </Button>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="hidden"
          />
        </div>
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-48 rounded-md object-contain"
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Max file size: 5MB. Supported formats: JPG, PNG, GIF, SVG.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="uploaderName">Your Name (Optional)</Label>
          <Input
            id="uploaderName"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Your name"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uploaderEmail">Your Email (Optional)</Label>
          <Input
            id="uploaderEmail"
            type="email"
            value={uploaderEmail}
            onChange={(e) => setUploaderEmail(e.target.value)}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !image}
          className="w-full bg-nbkr hover:bg-nbkr-dark"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Logo'
          )}
        </Button>
      </div>
    </form>
  );
};

export default LogoSubmissionForm;
