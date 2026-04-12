import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ShieldCheck } from "lucide-react";

interface AgeVerificationProps {
  open: boolean;
  onVerify: () => void;
}

export function AgeVerification({ open, onVerify }: AgeVerificationProps) {
  const [birthDate, setBirthDate] = useState("");

  const handleVerify = () => {
    if (!birthDate) return;
    
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age >= 21) {
      localStorage.setItem("ageVerified", "true");
      onVerify();
    } else {
      alert("You must be 21 or older to access this site.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wine/10">
            <ShieldCheck className="h-6 w-6 text-wine" />
          </div>
          <DialogTitle className="text-2xl font-bold text-wine">Age Verification</DialogTitle>
          <p className="text-muted-foreground">
            You must be 21 years or older to access this website
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="birthdate" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date of Birth
            </label>
            <input
              id="birthdate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-wine focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleVerify}
              disabled={!birthDate}
              className="flex-1 bg-wine hover:bg-wine-light text-white"
            >
              Verify Age
            </Button>
            <Button
              variant="outline"
              onClick={() => window.close()}
              className="flex-1"
            >
              Exit
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            By proceeding, you confirm that you are of legal drinking age and agree to our terms.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}