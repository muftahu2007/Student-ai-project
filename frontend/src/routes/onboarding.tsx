import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { API_BASE_URL } from "../lib/api";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { UploadCloud, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingComponent,
});

function OnboardingComponent() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState("");
  
  type ExtractedData = {
    fullName: string;
    matricNumber: string;
    department: string;
    faculty: string;
    level: string;
    program: string;
  };

  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsExtracting(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/auth/extract-admission/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to extract information from document.");
      }

      const data = await res.json();
      setExtractedData({
        fullName: data.fullName || "",
        matricNumber: data.matricNumber || "",
        department: data.department || "",
        faculty: data.faculty || "",
        level: data.level || "",
        program: data.program || "",
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during extraction.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedData) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: extractedData.fullName,
          matric_number: extractedData.matricNumber,
          department: extractedData.department,
          faculty: extractedData.faculty,
          level: extractedData.level,
          program: extractedData.program,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create profile.");
      }

      // Successful profile creation, navigate to dashboard
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "An error occurred while saving your profile.");
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof ExtractedData, value: string) => {
    if (extractedData) {
      setExtractedData({ ...extractedData, [field]: value });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg border-2 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Student Onboarding</CardTitle>
          <CardDescription>
            {extractedData
              ? "Review and confirm your extracted information"
              : "Upload your admission letter to verify your student status"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {!extractedData ? (
            <div className="space-y-6">
              <div 
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${
                  file ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
                }`}
              >
                <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />
                <Label
                  htmlFor="admission-letter"
                  className="mb-2 cursor-pointer text-sm font-semibold text-primary hover:underline"
                >
                  Click to upload PDF
                </Label>
                <p className="text-xs text-muted-foreground">PDF files up to 5MB</p>
                <Input
                  id="admission-letter"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {file && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {file.name}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={!file || isExtracting} 
                className="w-full h-11 text-base font-medium"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting Information...
                  </>
                ) : (
                  "Verify Document"
                )}
              </Button>
              
              <div className="text-center text-xs text-muted-foreground">
                Having trouble with extraction? <button onClick={() => setExtractedData({fullName: "", matricNumber: "", department: "", faculty: "", level: "", program: ""})} className="text-primary hover:underline">Enter manually</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={extractedData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricNumber">Matric Number</Label>
                  <Input
                    id="matricNumber"
                    value={extractedData.matricNumber}
                    onChange={(e) => updateField("matricNumber", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={extractedData.department}
                    onChange={(e) => updateField("department", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty</Label>
                  <Input
                    id="faculty"
                    value={extractedData.faculty}
                    onChange={(e) => updateField("faculty", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    value={extractedData.level}
                    onChange={(e) => updateField("level", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Input
                    id="program"
                    value={extractedData.program}
                    onChange={(e) => updateField("program", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full h-11 mt-6 text-base font-medium">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Confirm & Continue"
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setExtractedData(null)}>
                Go Back
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
