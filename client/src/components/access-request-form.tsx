import { useState } from "react";
import { useCreateAccessRequest } from "@/hooks/use-s3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";
import type { S3Bucket } from "@shared/schema";

interface AccessRequestFormProps {
  restrictedBuckets: S3Bucket[];
  onSuccess?: () => void;
}

export function AccessRequestForm({ restrictedBuckets, onSuccess }: AccessRequestFormProps) {
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [duration, setDuration] = useState<string>("1");
  const [justification, setJustification] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  
  const createRequest = useCreateAccessRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBucket || !duration || !justification.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createRequest.mutateAsync({
        bucketId: parseInt(selectedBucket),
        requestedDuration: parseInt(duration),
        justification: justification.trim(),
      });
      
      setShowSuccessDialog(true);
      setSelectedBucket("");
      setDuration("1");
      setJustification("");
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit access request",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bucket" className="block text-sm font-medium text-gray-700 mb-2">
              Select Bucket
            </Label>
            <Select value={selectedBucket} onValueChange={setSelectedBucket}>
              <SelectTrigger className="focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Select a restricted bucket..." />
              </SelectTrigger>
              <SelectContent>
                {restrictedBuckets.map((bucket) => (
                  <SelectItem key={bucket.id} value={bucket.id.toString()}>
                    {bucket.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Access Duration
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="focus:ring-primary focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-2">
            Justification
          </Label>
          <Textarea
            id="justification"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={3}
            placeholder="Please provide a reason for requesting access..."
            className="focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createRequest.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {createRequest.isPending ? (
              "Submitting..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Request Submitted</DialogTitle>
            <DialogDescription className="text-center">
              Your access request has been submitted to the administrators for review. 
              You will be notified once a decision is made.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={() => setShowSuccessDialog(false)} className="bg-primary hover:bg-primary/90">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
