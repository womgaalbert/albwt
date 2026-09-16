import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";

/**
 * Mock image classification based on filename heuristics.
 * Simulates the full upload + classify pipeline.
 */
function mockClassify(file) {
  const fileName = file.name.toLowerCase();
  const fileType = file.type || 'unknown';
  const fileSizeKB = Math.round(file.size / 1024);

  let mainObject = 'Unknown object';
  let categories = ['Digital image'];
  let description = '';

  if (fileName.includes('cat') || fileName.includes('kitten') || fileName.includes('chat')) {
    mainObject = 'Cat (Felis catus)';
    categories = ['Animal', 'Mammal', 'Pet'];
    description = 'A domestic cat. The image likely shows a feline with characteristic features such as pointed ears, whiskers, and fur patterns.';
  } else if (fileName.includes('dog') || fileName.includes('puppy') || fileName.includes('chien')) {
    mainObject = 'Dog (Canis familiaris)';
    categories = ['Animal', 'Mammal', 'Pet'];
    description = 'A domestic dog. The image likely captures canine features including the snout, ears, and body posture.';
  } else if (fileName.includes('car') || fileName.includes('vehicle') || fileName.includes('voiture')) {
    mainObject = 'Vehicle';
    categories = ['Transportation', 'Machine', 'Vehicle'];
    description = 'A motor vehicle. The image likely shows a car, truck, or other automobile with recognizable body panels, windows, and wheels.';
  } else if (fileName.includes('person') || fileName.includes('people') || fileName.includes('face') || fileName.includes('portrait')) {
    mainObject = 'Person / Human face';
    categories = ['Person', 'Portrait', 'Photography'];
    description = 'A photograph of a person or group of people showing facial features, expressions, and possibly body language.';
  } else if (fileName.includes('building') || fileName.includes('house') || fileName.includes('architecture')) {
    mainObject = 'Building / Architecture';
    categories = ['Architecture', 'Structure', 'Urban'];
    description = 'A building or architectural structure showing design elements, windows, and construction materials.';
  } else if (fileName.includes('landscape') || fileName.includes('nature') || fileName.includes('mountain') || fileName.includes('forest')) {
    mainObject = 'Natural landscape';
    categories = ['Nature', 'Landscape', 'Scenery'];
    description = 'A natural outdoor scene, likely featuring terrain, vegetation, sky, and possibly water elements.';
  } else if (fileName.includes('food') || fileName.includes('meal') || fileName.includes('dish')) {
    mainObject = 'Food / Culinary item';
    categories = ['Food', 'Cuisine', 'Photography'];
    description = 'A food item or prepared dish, showing culinary presentation, ingredients, and plating.';
  } else {
    mainObject = `Image (${fileType})`;
    categories = ['Photograph', 'Digital image'];
    description = `A ${fileType} image (${fileSizeKB} KB). The content appears to be a standard photograph or digital graphic. For accurate classification, connect a real computer vision model such as a fine-tuned CNN or a vision-language model.`;
  }

  const confidence = 75 + Math.floor(Math.random() * 20); // 75-94 range for demo

  return {
    main_object: mainObject,
    description: `${description} [Demo classification based on filename: "${file.name}" — ${fileSizeKB}KB, ${fileType}]`,
    categories,
    confidence,
  };
}

export default function ImageClassifier() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const objectUrlRef = useRef(null);

  // Revoke object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      objectUrlRef.current = url;
      setPreview(url);
      setResult(null);
    }
  };

  const clearFile = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const handleClassify = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      // Simulate upload + classification delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      const mockResult = mockClassify(file);
      setResult(mockResult);
    } catch (error) {
      setResult({
        main_object: "Error",
        description: "Failed to classify image. Please try again.",
        categories: [],
        confidence: 0,
      });
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl">Image Classifier</h2>
          <p className="text-gray-500 text-sm">Demo mode · Filename-based classification</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {!preview ? (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-[#1e2a3a] rounded-xl p-12 text-center hover:border-purple-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-1">Click to upload an image</p>
              <p className="text-gray-600 text-xs">Supports JPG, PNG, WebP</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-96 object-contain bg-[#0a0f1e] rounded-xl"
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {preview && (
          <Button
            onClick={handleClassify}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Classifying...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" /> Classify Image
              </>
            )}
          </Button>
        )}
      </div>

      {result && (
        <div className="bg-[#0a0f1e] border border-[#1e2a3a] rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-1">Main Object</h3>
            <p className="text-teal-400 text-lg font-medium">{result.main_object}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Description</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{result.description}</p>
          </div>

          {result.categories && result.categories.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {result.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-white font-semibold mb-2">
              Confidence: {result.confidence}%
            </h3>
            <div className="w-full bg-[#111827] rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
