import React, { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import { AIGenerateMealData, AINutritionAnalysisData } from '../../types';

const AIServices: React.FC = () => {
  const {
    analyses,
    loading,
    error,
    generateMeal,
    analyzeNutrition,
    getAnalysisHistory,
    clearError,
  } = useAI();

  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [showAnalysisForm, setShowAnalysisForm] = useState(false);
  const [generatedMeal, setGeneratedMeal] = useState<any>(null);
  const [nutritionAnalysis, setNutritionAnalysis] = useState<any>(null);

  // Form states
  const [generateFormData, setGenerateFormData] = useState<AIGenerateMealData>({
    mealType: 'breakfast',
    preferences: [],
  });

  const [analysisFormData, setAnalysisFormData] = useState<AINutritionAnalysisData>({
    mealData: {
      name: '',
      ingredients: [],
      nutrition: undefined,
    },
  });

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    amount: 0,
    unit: '',
  });

  const [newPreference, setNewPreference] = useState('');

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const commonPreferences = [
    'high_protein', 'low_carb', 'vegetarian', 'vegan', 'gluten_free',
    'dairy_free', 'keto', 'paleo', 'mediterranean', 'asian', 'mexican'
  ];

  // Handle form input changes
  const handleGenerateFormChange = (field: keyof AIGenerateMealData, value: any) => {
    setGenerateFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalysisFormChange = (field: string, value: any) => {
    setAnalysisFormData(prev => ({
      ...prev,
      mealData: { ...prev.mealData, [field]: value }
    }));
  };

  const addPreference = () => {
    if (newPreference.trim() && !generateFormData.preferences.includes(newPreference)) {
      setGenerateFormData(prev => ({
        ...prev,
        preferences: [...prev.preferences, newPreference.trim()]
      }));
      setNewPreference('');
    }
  };

  const removePreference = (preference: string) => {
    setGenerateFormData(prev => ({
      ...prev,
      preferences: prev.preferences.filter(p => p !== preference)
    }));
  };

  const addIngredient = () => {
    if (newIngredient.name.trim() && newIngredient.amount > 0) {
      setAnalysisFormData(prev => ({
        ...prev,
        mealData: {
          ...prev.mealData,
          ingredients: [...prev.mealData.ingredients, { ...newIngredient }]
        }
      }));
      setNewIngredient({ name: '', amount: 0, unit: '' });
    }
  };

  const removeIngredient = (index: number) => {
    setAnalysisFormData(prev => ({
      ...prev,
      mealData: {
        ...prev.mealData,
        ingredients: prev.mealData.ingredients.filter((_, i) => i !== index)
      }
    }));
  };

  // Handle form submissions
  const handleGenerateMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (generateFormData.preferences.length === 0) {
      alert('Please add at least one preference');
      return;
    }
    
    try {
      const result = await generateMeal(generateFormData);
      setGeneratedMeal(result);
      setShowGenerateForm(false);
    } catch (err) {
      console.error('Failed to generate meal:', err);
    }
  };

  const handleAnalyzeNutrition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (analysisFormData.mealData.ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }
    
    try {
      const result = await analyzeNutrition(analysisFormData);
      setNutritionAnalysis(result);
      setShowAnalysisForm(false);
    } catch (err) {
      console.error('Failed to analyze nutrition:', err);
    }
  };

  const getMealTypeName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Services</h1>
        <p className="text-gray-600 mb-6">
          Leverage AI to generate personalized meal suggestions and analyze nutrition information.
        </p>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowGenerateForm(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Generate Meal
          </button>
          
          <button
            onClick={() => setShowAnalysisForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Analyze Nutrition
          </button>
          
          <button
            onClick={() => getAnalysisHistory(10)}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            View History
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button
              onClick={clearError}
              className="ml-2 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* AI Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generate Meal Service */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">AI Meal Generation</h3>
              <p className="text-gray-600 text-sm">Get personalized meal suggestions based on your preferences</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Specify meal type (breakfast, lunch, dinner, snack)</p>
            <p>• Add dietary preferences and restrictions</p>
            <p>• Receive AI-generated meal recommendations</p>
            <p>• Get nutritional insights and cooking tips</p>
          </div>
          
          <button
            onClick={() => setShowGenerateForm(true)}
            className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Generate Meal
          </button>
        </div>

        {/* Nutrition Analysis Service */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Nutrition Analysis</h3>
              <p className="text-gray-600 text-sm">Analyze the nutritional content of your meals</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Input meal ingredients and quantities</p>
            <p>• Get detailed nutritional breakdown</p>
            <p>• Receive health insights and recommendations</p>
            <p>• Track macronutrients and micronutrients</p>
          </div>
          
          <button
            onClick={() => setShowAnalysisForm(true)}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Analyze Nutrition
          </button>
        </div>
      </div>

      {/* Analysis History */}
      {analyses.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent AI Analyses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.slice(0, 6).map((analysis, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    {analysis.analysis_type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Input:</p>
                  <p className="truncate">{JSON.stringify(analysis.input_data).substring(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Meal Modal */}
      {showGenerateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Generate AI Meal</h2>
              <form onSubmit={handleGenerateMeal}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Type
                  </label>
                  <select
                    value={generateFormData.mealType}
                    onChange={(e) => handleGenerateFormChange('mealType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {mealTypes.map(type => (
                      <option key={type} value={type}>{getMealTypeName(type)}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Preferences
                  </label>
                  
                  <div className="mb-4">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newPreference}
                        onChange={(e) => setNewPreference(e.target.value)}
                        placeholder="Add custom preference"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={addPreference}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {commonPreferences.map(pref => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => {
                            if (!generateFormData.preferences.includes(pref)) {
                              handleGenerateFormChange('preferences', [...generateFormData.preferences, pref]);
                            }
                          }}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            generateFormData.preferences.includes(pref)
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {pref.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {generateFormData.preferences.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Preferences:</p>
                      <div className="flex flex-wrap gap-2">
                        {generateFormData.preferences.map((pref, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-2"
                          >
                            {pref.replace('_', ' ')}
                            <button
                              type="button"
                              onClick={() => removePreference(pref)}
                              className="text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateForm(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Generate Meal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Analysis Modal */}
      {showAnalysisForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Analyze Nutrition</h2>
              <form onSubmit={handleAnalyzeNutrition}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Name
                  </label>
                  <input
                    type="text"
                    value={analysisFormData.mealData.name}
                    onChange={(e) => handleAnalysisFormChange('name', e.target.value)}
                    placeholder="e.g., Grilled Chicken Salad"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Ingredient name"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={newIngredient.amount}
                        onChange={(e) => setNewIngredient(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        min="0"
                        step="0.1"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={newIngredient.unit}
                        onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      + Add Ingredient
                    </button>
                  </div>

                  {analysisFormData.mealData.ingredients.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Ingredients:</p>
                      <div className="space-y-2">
                        {analysisFormData.mealData.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium">{ingredient.name}</span>
                              <span className="text-gray-600">{ingredient.amount} {ingredient.unit}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeIngredient(index)}
                              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAnalysisForm(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Analyze Nutrition
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Generated Meal Result */}
      {generatedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">AI Generated Meal</h2>
                <button
                  onClick={() => setGeneratedMeal(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-green-800 mb-2">Generated for:</h3>
                <p className="text-green-700">
                  {getMealTypeName(generateFormData.mealType)} with preferences: {generateFormData.preferences.join(', ')}
                </p>
              </div>
              
              <div className="prose max-w-none">
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(generatedMeal, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Analysis Result */}
      {nutritionAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Nutrition Analysis Result</h2>
                <button
                  onClick={() => setNutritionAnalysis(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Analyzed Meal:</h3>
                <p className="text-blue-700">{analysisFormData.mealData.name}</p>
              </div>
              
              <div className="prose max-w-none">
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(nutritionAnalysis, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIServices;
